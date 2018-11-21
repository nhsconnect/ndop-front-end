import React from 'react';
import {SectionReadingWidth} from './section-reading.js';


const SectionTwoThirds = (props) => {
  return <SectionReadingWidth>
    <div className="column--two-thirds">
      {props.children}
    </div>
  </SectionReadingWidth>;
};

export {SectionTwoThirds};
