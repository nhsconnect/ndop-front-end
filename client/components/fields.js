import React from 'react';
import PropTypes from 'prop-types';

export const Paragraph = (props) => {
  return <p id={props.id}>{props.children}</p>;
};

Paragraph.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node
};
