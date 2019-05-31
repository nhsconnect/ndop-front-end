import React from 'react';
import PropTypes from 'prop-types';

import {VerificationForm} from './page/form.js';
import {FormContent} from './page/form-content.js';
import {VerificationRadio} from './page/radio.js';

import {SectionTwoThirds} from '../../../components/page-composition/section-two-thirds.js';
import {ErrorBox} from '../../../components/page-composition/error-box.js';


export const Page = (props) => {

  return <div id="holder">
    <div className="page-section">
      <SectionTwoThirds>
        <div className="reading-width">
          <ErrorBox
            title="There is a problem"
            validForm={props.validForm}>
            <li className={props.validForm ? 'util-displaynone' : ''}>
              <a id="radioOptionsLink" href="#verification-option">Select where we should send your security code</a>
            </li>
          </ErrorBox>

          <h1 className="h2">Get your security code</h1>

          <p>
            With the details you gave us we think we’ve found your contact details from your health records.
            { !!props.email ^ !!props.sms
              ? ` We could only find your ${props.email ? "email address" : "mobile number"}.`
              : "" }
          </p>
          <p>We now need to send you a security code. After 30 minutes your security code will not work.</p>

          <VerificationForm
            handleSubmit={props.handleSubmit}
            disabled={props.disabled}>

            <FormContent
              validForm={props.validForm}
              email={props.email}
              sms={props.sms}>

              {props.email && props.sms
                ? <VerificationRadio
                    email={props.email}
                    sms={props.sms}
                    verificationChoice={props.verificationChoice}
                    setVerificationChoice={props.setVerificationChoice}/>
                : null}

            </FormContent>

          </VerificationForm>
        </div>
      </SectionTwoThirds>
    </div>
  </div>;
};

Page.propTypes = {
  validForm: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  verificationChoice: PropTypes.string,
  setVerificationChoice: PropTypes.func.isRequired,
  email: PropTypes.string,
  sms: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
};
