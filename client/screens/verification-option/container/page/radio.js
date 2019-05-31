import React from 'react';
import PropTypes from 'prop-types';

import {RadioButton} from '../../../../components/buttons/radio-button.js';


export const VerificationRadio = (props) => {

  let radioButtonSharedProps = {
    onChange: props.setVerificationChoice,
    name: 'VerificationOption',
    labelClassName: 'form-label form-label--radio'
  };

  return <div>
    <RadioButton {...radioButtonSharedProps}
      id="radioEmail"
      value="email"
      checked={props.verificationChoice === 'email'}
      labelText={'By email to ' + props.email}
      labelId="label-for-radioEmail"/>

    <RadioButton {...radioButtonSharedProps}
      id="radioSMS"
      value="sms"
      checked={props.verificationChoice === 'sms'}
      labelText={'By text to ' + props.sms}
      labelId="label-for-radioSMS"/>
  </div>
};

VerificationRadio.propTypes = {
  setVerificationChoice: PropTypes.func.isRequired,
  verificationChoice:PropTypes.string
};
