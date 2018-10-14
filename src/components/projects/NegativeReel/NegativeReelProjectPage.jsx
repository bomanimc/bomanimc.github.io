/* eslint no-confusing-arrow: 0 */

import React from 'react';
import NegativeReelContentPath from './negativereel.md';
import { ProjectContent } from '../../../constants';
import { BaseProjectPage, BaseBodyContent } from '../commonProjectComponents';

const project = ProjectContent.negativereel;

const NegativeReelProjectPage = () => (
  <BaseProjectPage
    title={project.title}
    tools={project.tools}
    role={project.role}
    site={project.site}
    body={
      <BaseBodyContent
        project={project}
        introContentPath={NegativeReelContentPath}
      />
    }
  />
);

export default NegativeReelProjectPage;
