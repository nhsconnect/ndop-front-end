import React from 'react';
import PropTypes from 'prop-types';

export const RadioButton = (props) => {
  return <div>
    <input
      id={props.id}
      type="radio"
      value={props.value}
      checked={props.checked}
      onChange={props.onChange}
      className="form-label form-label--radio"
      name={props.name}>
    </input>
    <label id={props.labelId} htmlFor={props.id} className={props.labelClassName}>
      {props.labelText}
    </label>
  </div>;
};

RadioButton.propTypes = {
  checked: PropTypes.bool,
  id: PropTypes.string,
  labelClassName: PropTypes.string,
  labelText: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
