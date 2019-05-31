import React from 'react';
import PropTypes from 'prop-types';

import {SectionTwoThirds} from '../../components/page-composition/section-two-thirds.js';
import {Title} from '../../components/page-composition/title.js';

import {Content} from './page/content.js';


const Page = (props) => {
  return <div id="holder">
    <Title text="Your choice has been saved"/>
    <SectionTwoThirds>
      <Content preference={props.preference}/>
    </SectionTwoThirds>
  </div>;
};

export {
  Page
};


Page.propTypes = {
  preference: PropTypes.string.isRequired,
};
