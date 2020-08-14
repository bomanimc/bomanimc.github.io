import React from 'react';
import PropTypes from 'prop-types';
import styled, {ThemeProvider} from 'styled-components';
import SEO from './seo';
import NavBar from './partials/NavBar';
import LinksBar from './partials/LinksBar';
import { SocialLinks } from '../constants';
import theme from '../theme';

const BaseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  align-content: center;
  flex-direction: column;
  padding: 0 3rem;

  @media screen and (max-width: ${(p) => p.theme.breakPoints.mobile}) {
    padding: 0 1rem;
  }
`;

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <BaseWrapper>
      <SEO />
      <NavBar />
      <ContentWrapper>
        {children}
      </ContentWrapper>
      <LinksBar links={SocialLinks} />
    </BaseWrapper>
  </ThemeProvider>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
