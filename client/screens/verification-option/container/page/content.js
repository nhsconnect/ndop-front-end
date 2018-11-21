import React from 'react';
import PropTypes from 'prop-types';

import {SuccessAlert} from '../../../../components/alerts/success-flash.js';


export const Content = (props) => {
  return <div>
    { (props.validForm && !props.disabled) ?
      (
        <SuccessAlert>
          Success! We believe we&#39;ve found a match based on the details you&#39;ve provided
        </SuccessAlert>
      )
      : ''
    }
    <p>We now need to send you a verification code. Your verification code will be sent to the option you choose below.</p>
    <p>The code will expire 30 minutes after you have chosen your option.</p>
  </div>;
};

Content.propTypes = {
  validForm: PropTypes.bool,
  disabled: PropTypes.bool
};
