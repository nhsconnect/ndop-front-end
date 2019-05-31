import React from 'react';
import PropTypes from 'prop-types';


export const FormContent = (props) => {
  let formTitle = null;

  if (props.email && props.sms) {
    formTitle = <legend className="h3">Where should we send your security code?</legend>
  } else if (props.email && !props.sms) {
    formTitle = <h2 className="h3">We&apos;ll send your security code by email to <span className='otp-contact_field' id='contact-value'>{props.email}</span></h2>
  } else if (props.sms && !props.email) {
    formTitle = <h2 className="h3">We&apos;ll send your security code by text to <span className='otp-contact_field' id='contact-value'>{props.sms}</span></h2>
  }

  return <fieldset
    id="verification-option"
    className={'form-group form-row ' + (props.validForm ? '' : 'form-row-error-active')}>

    {formTitle}

    <div className={'error error-message ' + (props.validForm ? '' : 'error-message-active')}>
      <p className="error-text error-label">Select where we should send your security code</p>
    </div>

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
