import React from 'react';
import PropTypes from 'prop-types';

import {VerificationForm} from './page/form.js';
import {Content} from './page/content.js';
import {FormContent} from './page/form-content.js';
import {VerificationRadio} from './page/radio.js';

import {SectionTwoThirds} from '../../../components/page-composition/section-two-thirds.js';
import {PageStepper} from '../../../components/page-composition/page-stepper.js';
import {ErrorBox} from '../../../components/page-composition/error-box.js';


export const Page = (props) => {

  return <div id="holder">
    <PageStepper
      title="Verification option"
      step="2">
      <SectionTwoThirds>
        <div className="reading-width">
          <Content
            validForm={props.validForm}
            disabled={props.disabled}/>

          <ErrorBox
            title="Select a verification option to continue"
            validForm={props.validForm}>
            <li className={props.validForm ? 'util-displaynone' : ''}>
              <a id="radioOptionsLink" href="#verification-option">No verification option selected</a>
            </li>
          </ErrorBox>

          <VerificationForm
            handleSubmit={props.handleSubmit}
            disabled={props.disabled}>

            <FormContent
              validForm={props.validForm}
              email={props.email}
              sms={props.sms}>

              <VerificationRadio
                email={props.email}
                sms={props.sms}
                verificationChoice={props.verificationChoice}
                setVerificationChoice={props.setVerificationChoice}/>

            </FormContent>

          </VerificationForm>
        </div>
      </SectionTwoThirds>
    </PageStepper>
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
