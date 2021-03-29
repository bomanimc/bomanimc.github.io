import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import * as Tone from 'tone';
import Draggable from 'react-draggable';
import Layout from '../../components/layout';
import { BaseAnimationPage } from '../../components/commonComponents';

const allOscillatorTypes = ['sine', 'triangle', 'square', 'sawtooth'];
const allTuningRatioOptions = ['manual', 'clock'];

const SoundTexture = () => {
  const baseChannel = useRef(null);
  const [areControlsExposed, setAreControlsExposed] = useState(true);
  const [audioContextStarted, setAudioContextStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedOscillatorTypes, setSelectedOscillatorTypes] = useState({ x: 'sine', y: 'sine' });
  const [
    selectedTuningRatioOption,
    setSelectedTuningRatioOption,
  ] = useState(allTuningRatioOptions[0]);
  const [oscillators, setOscillators] = useState({});
  const [xFrequencyScaling, setXFrequencyScaling] = useState(1);
  const [yFrequencyScaling, setYFrequencyScaling] = useState(1);
  const middleCFrequency = 261.6;

  const initializeOscillator = (type, frequency, phase = 0) => {
    const oscillator = new Tone.Oscillator({
      type,
      frequency: frequency || middleCFrequency,
      phase,
    });
    oscillator.volume.value = -30;

    return oscillator;
  };

  useEffect(() => {
    Tone.Destination.mute = isMuted;
  }, [isMuted]);

  useEffect(() => {
    baseChannel.current = new Tone.Channel();

    return () => {
      Object.values(oscillators).map((oscillator) => oscillator.stop().dispose());
      if (baseChannel.current) {
        baseChannel.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    Object.values(oscillators).map((oscillator) => oscillator.dispose());
    const { x: xType, y: yType } = selectedOscillatorTypes;

    const oscillatorX = initializeOscillator(xType, middleCFrequency * xFrequencyScaling);
    oscillatorX.connect(baseChannel.current);

    const oscillatorY = initializeOscillator(yType, middleCFrequency * yFrequencyScaling, 90);
    oscillatorY.connect(baseChannel.current);

    baseChannel.current.toDestination();

    setOscillators({
      x: oscillatorX,
      y: oscillatorY,
    });
  }, [selectedOscillatorTypes, xFrequencyScaling, yFrequencyScaling]);

  const onToggleMuted = () => {
    setIsMuted(!isMuted);
  };

  const onToggleControls = () => setAreControlsExposed(!areControlsExposed);

  const onStartAudioContext = () => {
    Tone.context.resume();
    setAudioContextStarted(true);
  };

  const onPlayTexture = () => {
    console.log('PLAY');
    Object.values(oscillators).forEach((oscillator) => oscillator.start());
  };

  const onStopTexture = () => {
    console.log('PAUSE');
    Object.values(oscillators).forEach((oscillator) => oscillator.stop());
  };

  return (
    <Layout showLinksBar={false}>
      <BaseAnimationPage title="Sound Texture">
        <SoundTexture.Content>
          <Draggable>
            <SoundTexture.Area
              onMouseEnter={onPlayTexture}
              onMouseLeave={onStopTexture}
            />
          </Draggable>
        </SoundTexture.Content>
        <SoundTexture.ControlsPanel>
          <SoundTexture.ControlsHeader>
            <span>Controls</span>
            <SoundTexture.ControlsHeaderButton onClick={onToggleControls}>
              {areControlsExposed ? '–' : '+'}
            </SoundTexture.ControlsHeaderButton>
          </SoundTexture.ControlsHeader>
          <SoundTexture.ControlsContent isExposed={areControlsExposed}>
            {!audioContextStarted && (
              <SoundTexture.ControlPanelSection>
                <SoundTexture.FlashingButton
                  isSelected={isMuted}
                  onClick={onStartAudioContext}
                >
                  Activate Audio Context
                </SoundTexture.FlashingButton>
              </SoundTexture.ControlPanelSection>
            )}
            <SoundTexture.ControlPanelSection>
              <SoundTexture.Button isSelected={isMuted} onClick={onToggleMuted}>{isMuted ? 'Unmute' : 'Mute'}</SoundTexture.Button>
            </SoundTexture.ControlPanelSection>
          </SoundTexture.ControlsContent>
        </SoundTexture.ControlsPanel>
      </BaseAnimationPage>
    </Layout>
  );
};

SoundTexture.Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

SoundTexture.Area = styled.div`
  height: 300px;
  width: 300px;
  background: blue;
`;

SoundTexture.ControlsPanel = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  border: 1px solid white;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 15rem;
  background: black;

  @media (max-width: ${(p) => p.theme.breakPoints.mobile}) {
    width: unset;
    left: 1rem;
  }
`;

SoundTexture.ControlsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: bold;
  border-bottom: 1px solid white;
  flex: 1;
  background: rgba(0, 0, 255, .37);
`;

SoundTexture.ControlsHeaderButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  color: white;
  font-size: 1rem;
  font-weight: bold;
`;

SoundTexture.ControlsContent = styled.div`
  display: ${(p) => (p.isExposed ? 'block' : 'none')};
`;

SoundTexture.ControlPanelSection = styled.div`
  padding: 0.5rem;
`;

SoundTexture.ControlRow = styled.div`
  display: flex;
  font-size: 0.75rem;
  flex-direction: column;
  margin: 0.5rem 0;

  :last-child {
    margin-bottom: 0;
  }
`;

SoundTexture.ControlLabel = styled.div`
  margin-bottom: 0.5rem;
`;

SoundTexture.ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.5rem;
`;

const flashingBorder = keyframes`    
  from, to {    
    border-color: white;
  }    
  50% {    
    border-color: yellow;   
  }    
`;

SoundTexture.Button = styled.button`
  background: ${(p) => (p.isSelected ? 'rgba(0, 0, 255, 0.37)' : 'none')};
  color: white;
  text-transform: capitalize;
  border: 1px solid white;
  padding: 0.5rem;
  width: 100%;

  &:disabled {
    color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
`;

SoundTexture.FlashingButton = styled(SoundTexture.Button)`
  animation: 0.5s ${flashingBorder} ease-out infinite;
`;

SoundTexture.Input = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: transparent;
  outline: none;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid white;
`;

SoundTexture.SectionTitle = styled.p`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export default SoundTexture;
