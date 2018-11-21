import React from 'react';


const Section = (props) => {
  return <div className="page-section">
    <div className="grid-row">
      {props.children}
    </div>
  </div>;
};

export {Section};
