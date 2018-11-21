import React from 'react';
import PropTypes from 'prop-types';

export const FormText = (props) => {

  return <span className="form-label__hint">
  The full
    {(props.email && props.sms) ? ' email address and phone number have '
      : (!props.sms) ? ' email address has '
        : (!props.email) ? ' phone number has '
          : ''}
   been hidden for your privacy
  </span>;
};

FormText.propTypes = {
  email: PropTypes.string.isRequired,
  sms: PropTypes.string.isRequired
};
