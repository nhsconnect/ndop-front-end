import React from 'react';
import PropTypes from 'prop-types';

import {SubmitButton} from '../../../../components/buttons/submit-button.js';
import {CONTACT_DETAILS_NOT_RECOGNISED_ENDPOINT} from '../../../../common/endpoints.js';

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
      value="Get code"/>

    <p>
      <a href={CONTACT_DETAILS_NOT_RECOGNISED_ENDPOINT} id="contactDetailsUnrecognised">What to do if you think these contact details are wrong</a>
    </p>
  </form>;
};

VerificationForm.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
