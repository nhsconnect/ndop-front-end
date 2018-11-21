import React from 'react';
import PropTypes from 'prop-types';

import {RadioButton} from '../../../../components/buttons/radio-button.js';
import {Paragraph} from '../../../../components/fields.js';


export const VerificationRadio = (props) => {

  let radioButtonSharedProps = {
    onChange: props.setVerificationChoice,
    name: 'VerificationOption',
    labelClassName: 'form-label form-label--radio'
  };

  return <div>
    {
      !props.email ? null :
        <Paragraph id="holder-for-radioEmail">
          <RadioButton {...radioButtonSharedProps}
            id="radioEmail"
            value="email"
            checked={props.verificationChoice === 'email'}
            labelText={'Send an email to ' + props.email}
            labelId="label-for-radioEmail"/>
        </Paragraph>
    }
    {
      !props.sms ? null :
        <Paragraph id="holder-for-radioSMS">
          <RadioButton {...radioButtonSharedProps}
            id="radioSMS"
            value="sms"
            checked={props.verificationChoice === 'sms'}
            labelText={'Send an sms to ' + props.sms}
            labelId="label-for-radioSMS"/>
        </Paragraph>
    }
    <Paragraph id="holder-for-radioUnrecognised">
      <RadioButton {...radioButtonSharedProps}
        id="radioUnrecognised"
        value="unrecognised"
        checked={props.verificationChoice === 'unrecognised'}
        labelText="I do not recognise this email address or phone number"
        labelId="label-for-radioUnrecognised"/>
    </Paragraph>
  </div>;
};

VerificationRadio.propTypes = {
  setVerificationChoice: PropTypes.func.isRequired,
  verificationChoice:PropTypes.string,
  email: PropTypes.string,
  sms: PropTypes.string
};
