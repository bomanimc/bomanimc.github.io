/* eslint react/forbid-prop-types: 0 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown/with-html';
import { Image, Transformation } from 'cloudinary-react';
import { Helmet } from 'react-helmet';
import LinksBar from '../partials/LinksBar';
import { MediaTypes, SocialLinks, NavLinks } from '../../constants';
import {
  Link,
  TextContent,
  Divider,
  Page,
  PageCenteringContainer,
  PageTitle,
  BodySection,
  MetadataSection,
  MetadataItem,
  MetadataTitle,
  MetadataContent,
} from '../commonComponents';
import { setMetaTitle } from '../../utils';

export const BackButtonWrapper = styled.div`
  margin-bottom: 24px;
`;

export const BackButton = Link.extend`
  font-weight: bold;
`;

export const HiddenDivider = styled.div`
  margin: 48px 0px;
`;

export const ProjectPageImageContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

export const ProjectPageImage = styled(Image)`
  border: 1px solid white;
  width: 100%;
`;

export const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  border-style: solid;
  border-width: 1px 1px 1px 1px;
  border-color: white;
  width: 100%;
  margin-bottom: 16px;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const Metadata = ({ tools, role, site }) => (
  <MetadataSection>
    <MetadataItem>
      <MetadataTitle>Tools</MetadataTitle>
      <MetadataContent><ReactMarkdown source={tools} /></MetadataContent>
    </MetadataItem>
    <MetadataItem>
      <MetadataTitle>Role</MetadataTitle>
      <MetadataContent><ReactMarkdown source={role} /></MetadataContent>
    </MetadataItem>
    { site
      && (
      <MetadataItem>
        <MetadataTitle>External Site</MetadataTitle>
        <MetadataContent>
          <Link href={site}>{site}</Link>
        </MetadataContent>
      </MetadataItem>
      )
    }
  </MetadataSection>
);

export const getProjectMedia = (projectData, showMainMedia) => {
  const { projectMedia } = projectData;
  return showMainMedia
    ? [
      {
        type: MediaTypes.image,
        src: projectData.media,
      },
    ].concat(projectMedia)
    : projectMedia;
};

export const BaseProjectPage = ({
  id, title, tools, role, site, body,
}) => (
  <div>
    <LinksBar links={NavLinks} />
    <Helmet>
      {setMetaTitle(title)}
    </Helmet>
    <Page>
      <PageCenteringContainer>
        <BackButtonWrapper>
          <BackButton href={`/#${id}`}>Back</BackButton>
        </BackButtonWrapper>
        <PageTitle>{title}</PageTitle>
        <Metadata tools={tools} role={role} site={site} />
        <Divider />
        {body}
      </PageCenteringContainer>
    </Page>
    <LinksBar links={SocialLinks} />
  </div>
);

export class BaseBodyContent extends React.Component {
  constructor() {
    super();

    this.state = {
      introContent: null,
    };
  }

  componentWillMount() {
    const { introContentPath, project } = this.props;
    if (introContentPath === null || introContentPath === undefined) {
      this.setState({ introContent: project.body });
      return;
    }

    fetch(introContentPath)
      .then(response => response.text())
      .then(text => this.setState({ introContent: text }));
  }

  render() {
    const { project, showMainMedia } = this.props;
    const { introContent } = this.state;

    const mediaSection = getProjectMedia(project, showMainMedia).map((media) => {
      switch (media.type) {
        case MediaTypes.video:
          return (
            <VideoWrapper key={media.videoUrl}>
              <ReactPlayer url={media.videoUrl} />
            </VideoWrapper>
          );
        case MediaTypes.image:
        default:
          return (
            <ProjectPageImageContainer key={media.src}>
              <ProjectPageImage
                cloudName="bomani-personal"
                publicId={media.src}
              >
                <Transformation quality="auto:best" crop="limit" fetchFormat="auto" />
              </ProjectPageImage>
            </ProjectPageImageContainer>
          );
      }
    });

    return (
      <BodySection>
        <TextContent>
          <ReactMarkdown source={introContent} escapeHtml={false} />
        </TextContent>
        <HiddenDivider />
        {mediaSection}
      </BodySection>
    );
  }
}

Metadata.propTypes = {
  tools: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  site: PropTypes.string,
};

BaseProjectPage.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  tools: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  site: PropTypes.string,
};

BaseBodyContent.propTypes = {
  introContentPath: PropTypes.string,
  project: PropTypes.object.isRequired,
  showMainMedia: PropTypes.bool,
};

BaseBodyContent.defaultProps = {
  introContentPath: null,
  showMainMedia: true,
};

BaseProjectPage.defaultProps = {
  site: null,
};

Metadata.defaultProps = {
  site: null,
};
