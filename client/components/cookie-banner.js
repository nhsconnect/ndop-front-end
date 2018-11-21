import React from 'react';
import {COOKIE_POLICY_ENDPOINT} from '../common/endpoints.js';

export const CookieBanner = () => {
  return <div className="banner cookie">
    <div className="page-section">
    We install small files known as &quot;cookies&quot; on your device to make this service simpler. <br/>
      <a href={COOKIE_POLICY_ENDPOINT} target="_blank" rel="nofollow" title="Find out more or manage your cookie settings" id="cookieBannerLink">Find out more or manage your cookie settings<span className="util-visuallyhidden"> - Page opens in new window</span></a><span aria-hidden="true"> (opens in new window)</span>.
    </div>
  </div>;
};
