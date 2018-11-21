import React from 'react';
import PropTypes from 'prop-types';
import {PRIVACY_NOTICE_ENDPOINT, STATIC_RESOURCES_CDN_ENDPOINT} from '../../common/endpoints.js';

const LandingPageContent = (props) => {
  return <div className="callout callout--interruption alt">
    <h1 className="h2">How to manage your choice online</h1>
    <div className="grid-row">
      <div className="column--three-quarters tablet">
        <div className="reading-width">
          <p>
            Tell us your name, date of birth and NHS number or postcode.
          </p>
          <p>
            If we find your contact details, we'll then send you a security code. When your code is verified, you will be able to manage your choice online.
          </p>
          <a disabled={props.disabled} id="yourDetailsButton" onClick={props.onClick} className="button" type="submit" value="Confirm">Continue</a>
          <p>
            <a id="privacyNoticeLink" target="_blank" rel="noopener noreferrer" href={PRIVACY_NOTICE_ENDPOINT}>How your data will be processed to register and apply your opt-out
              <span className="util-visuallyhidden"> - Page opens in new window</span></a>
            <span aria-hidden="true"> (opens in new window).</span>
          </p>
        </div>
      </div>

      <div className="column--one-quarter tablet">
        <img alt="" className="util-displaynone-mobile" width="100%" src={STATIC_RESOURCES_CDN_ENDPOINT + '/images/choice-icon-white.svg'}/>
      </div>
    </div>
  </div>;
};


LandingPageContent.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export {LandingPageContent};
