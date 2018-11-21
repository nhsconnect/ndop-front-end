import React from 'react';
import PropTypes from 'prop-types';


import {FormText} from './form-content/text.js';

export const FormContent = (props) => {

  return <fieldset
    id="verification-option"
    className={'form-group form-row ' + (props.validForm ? '' : 'form-row-error-active')}>
    <legend className="h3 error-label">Where should we send your verification code?</legend>

    <div className={'error error-message ' + (props.validForm ? '' : 'error-message-active')}>
      <p className="error-text">To use the online service, select an option to continue</p>
    </div>

    <FormText email={props.email} sms={props.sms}/>

    {props.children}
  </fieldset>;
};

FormContent.propTypes = {
  validForm: PropTypes.bool.isRequired,
  setVerificationChoice: PropTypes.func.isRequired,
  verificationChoice: PropTypes.string,
  email: PropTypes.string,
  sms: PropTypes.string
};
