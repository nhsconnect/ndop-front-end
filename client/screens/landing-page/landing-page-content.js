import React from 'react';
import PropTypes from 'prop-types';
import {PRIVACY_NOTICE_ENDPOINT} from '../../common/endpoints.js';

const LandingPageContent = (props) => {
  let buttonClasses = ["button"];
  if (props.disabled) {
    buttonClasses.push("disabled");
  }
  return <div className="callout callout--interruption alt">
    <div className="grid-row">
      <div className="column--three-quarters tablet">
        <h1 className="h2">We need to check who you are before you can make your choice</h1>
        <div className="reading-width">
          <p>
            We&apos;ll need your:
          </p>
          <p>
            <ul>
                <li>name</li>
                <li>date of birth</li>
                <li>postcode or NHS number</li>
            </ul>
          </p>
          <p>
              We&apos;ll use these details to find your contact details from your health records so we can send you a security code.
          </p>
          <a id="yourDetailsButton" onClick={props.onClick} className={buttonClasses.join(" ")} role="button" href="#">Continue</a>
          <p>
            <a id="privacyNoticeLink" target="_blank" rel="noopener noreferrer" href={PRIVACY_NOTICE_ENDPOINT}>How your data will be processed using this service
              <span className="util-visuallyhidden"> - Page opens in new window</span></a>
            <span aria-hidden="true"> (opens in new window).</span>
          </p>
        </div>
      </div>
    </div>
  </div>;
};


LandingPageContent.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export {LandingPageContent};
