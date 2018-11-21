import React from 'react';
import PropTypes from 'prop-types';


const PageStepper = (props) => {
  return <div className="page-section">
    <h1 className="h2">{props.title}</h1>
    {props.children}
  </div>;
};

export {PageStepper};

PageStepper.propTypes = {
  title: PropTypes.string.isRequired,
  step: PropTypes.string.isRequired
};
