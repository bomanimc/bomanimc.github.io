/* eslint no-confusing-arrow: 0 */
/* eslint array-callback-return: 0 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ProjectCard from '../partials/ProjectCard';
import LinksBar from '../partials/LinksBar';
import { Link, Body, TextContent } from '../commonComponents';
import { ProjectContent, ProjectOrder, SocialLinks } from '../../constants';

const hoverNameAnimationSpeed = 1.5;

const Section = styled.section`
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  height: ${props => props.sectionHeight};
  min-height: ${props => props.minHeight};
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align};
  justify-content: space-between;
  margin-left: ${props => props.marginHorizontal ? props.marginHorizontal : '0px'};
  margin-right: ${props => props.marginHorizontal ? props.marginHorizontal : '0px'};
`;

const ContentContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.horizontalCenter ? 'center' : 'normal'};
  justify-content: ${props => props.verticalCenter ? 'center' : 'normal'};
  height: ${props => props.containerHeight ? props.containerHeight : '100%'};
  margin-top: ${props => props.marginTop ? props.marginTop : '0px'};
`;

const ProjectGridContainer = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-template-columns: repeat(2, 1fr);
  height: ${props => props.containerHeight ? props.containerHeight : '100%'};

  @media (max-width: 1100px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Introduction = ContentContainer.extend`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Name = styled.h1`
  font-family: Helvetica;
  color: white;
  font-size: 180px;
  line-height: 0.80;
  transition: opacity ${hoverNameAnimationSpeed}s ease;

  &:hover {
    color: #000000;
  }

  @media (max-width: 768px) {
    font-size: 5.5rem;
  }
`;

const Outro = Introduction.extend`
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 500px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Bio = Outro.extend`
  height: auto;
  text-align: center;
`;

const changeColor = (e) => {
  const splash = document.getElementById('root');
  splash.style.backgroundColor = e.target.getAttribute('data-color');

  if (e.target.id !== 'name') {
    document.getElementById('name').style.opacity = 0.3;
  } else {
    document.getElementById('name').style.opacity = 1;
  }
};

const HomePage = () => (
  <div id="root">
    <LinksBar links={SocialLinks} />
    <NameSection onChangeColor={changeColor} />
    <IntroSection />
    <ProjectSection />
    <OutroSection />
    <LinksBar links={SocialLinks} />
  </div>
);

const NameSection = ({ onChangeColor }) => (
  <Introduction horizontalCenter verticalCenter marginTop="36px">
    <Name
      id="name"
      data-color={'#000'}
      onMouseEnter={e => onChangeColor(e)}
    >
      BOMANI
    </Name>
  </Introduction>
);

const IntroSection = () => (
  <Section
    bgColor="black"
    textColor="white"
    align="normal"
    sectionHeight="20%"
    marginHorizontal="20px"
  >
    <ContentContainer horizontalCenter containerHeight="auto" marginTop="36px">
      <Bio>
        <Body>
          Bomani McClendon is a software engineer, designer, and
          aspiring artist based in New York City.
        </Body>
        <br />
        <Body>
          See his work below.
        </Body>
      </Bio>
    </ContentContainer>
  </Section>
);

const ProjectSection = () => (
  <Section
    bgColor="black"
    textColor="white"
    align="normal"
    sectionHeight="auto"
    minHeight={`${(ProjectContent.length * 250) + 200}px`}
    marginHorizontal="20px"
  >
    <ContentContainer horizontalCenter containerHeight="auto" marginTop="36px">
      <ProjectGridContainer containerHeight="auto">
        {
          ProjectOrder.map(section =>
            (<ProjectCard
              key={ProjectContent[section].id}
              content={ProjectContent[section]}
            />),
          )
        }
      </ProjectGridContainer>
    </ContentContainer>
  </Section>
);

const OutroSection = () => (
  <Section
    bgColor="black"
    textColor="white"
    align="center"
    sectionHeight="100vh"
    minHeight="600px"
    marginHorizontal="20px"
  >
    <Outro horizontalCenter verticalCenter>
      <TextContent>
        During the day, Bomani works on news products at Facebook.
        He has previously interned at IDEO, Grubhub, and Boeing.
        <br />
        <br />
        Bomani has conducted HCI & Learning Sciences research
        with <Link href="http://delta.northwestern.edu/">Delta Lab</Link>, and
        has contributed to journalism innovation projects as a Fellow
        at <Link href="https://knightlab.northwestern.edu/">Knight Lab</Link>.
        <br />
        <br />
        <br />
        See his full resume <Link href="/resume">here</Link>.
      </TextContent>
    </Outro>
  </Section>
);

NameSection.propTypes = {
  onChangeColor: PropTypes.func.isRequired,
};

export default HomePage;
