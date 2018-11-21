import React from 'react';
import PropTypes from 'prop-types';

export const SubmitButton = (props) => {
  return <input
    disabled={props.disabled}
    id={props.id}
    className="button"
    type="submit"
    role="button"
    value={props.value}>
  </input>;
};

SubmitButton.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool.isRequired
};
