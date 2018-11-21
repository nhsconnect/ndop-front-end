import React from 'react';
import PropTypes from 'prop-types';

import {SubmitButton} from '../../../../components/buttons/submit-button.js';

export const VerificationForm = (props) => {

  return <form
    id="verificationForm"
    className="form"
    onSubmit={props.handleSubmit}
    action="">

    {props.children}

    <SubmitButton
      disabled={props.disabled}
      id="verificationSubmitButton"
      value="Continue"/>

  </form>;
};

VerificationForm.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
