import React from 'react';
import {PRIVACY_NOTICE_ENDPOINT, TERMS_AND_CONDITIONS_ENDPOINT, COOKIE_POLICY_ENDPOINT} from '../common/endpoints.js';

export const Footer = () => {
  return <div className="global-footer">
    <div className="global-footer__inner">
      <div>
        <h2 className="util-visuallyhidden">Terms and conditions</h2>
        <ul className="link-list">
          <li><a id="privacyNoticeFooterLink" target="_blank" rel="noopener noreferrer" href={PRIVACY_NOTICE_ENDPOINT}>Privacy notice <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
          <li><a id="termsAndConditionsFooterLink" target="_blank" rel="noopener noreferrer" href={TERMS_AND_CONDITIONS_ENDPOINT}>Terms and conditions <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
          <li><a id="cookiePolicyFooterLink" target="_blank" rel="noopener noreferrer" href={COOKIE_POLICY_ENDPOINT}>Cookie policy <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
        </ul>
      </div>
    </div>
  </div>;
};
