import React from 'react';
import PropTypes from 'prop-types';


const Title = (props) => {
  return <div className="page-section">
    <h1 className="h2">{props.text}</h1>
  </div>;
};

export {Title};

Title.propTypes = {
  text: PropTypes.string.isRequired,
};
