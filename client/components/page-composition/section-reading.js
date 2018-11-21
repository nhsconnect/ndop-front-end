import React from 'react';


const SectionReadingWidth = (props) => {
  return <div className="page-section">
    <div className="reading-width">
      <div className="grid-row">
        {props.children}
      </div>
    </div>
  </div>;
};

export {SectionReadingWidth};
