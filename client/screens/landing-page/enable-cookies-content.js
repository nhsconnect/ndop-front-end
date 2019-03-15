import React from 'react';
import { SERVICE_NAME } from '../../common/constants';
import {OTHER_WAYS_TO_SET_YOUR_PREFERENCES_ENDPOINT} from '../../common/endpoints.js';

const EnableCookiesContent = () => {
  return <div>
    <h1 className="h2">Enable cookies to continue</h1>

    <div className="grid-row">
      <div className="column--two-thirds">
        <p>The &#39;{SERVICE_NAME}&#39; service puts small files (known as &#39;cookies&#39;) onto your computer to keep your visit secure.</p>
        <p>
          To be able to use this service online, you need to enable cookies.
        </p>
        <p>Find out more about&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://www.aboutcookies.org/">how to manage cookies
            <span className="util-visuallyhidden"> - Page opens in new window</span>
          </a>
          <span aria-hidden="true"> (opens in new window)</span>.
        </p>
        <br/>
        <h2 className="h3" id="other-ways-to-manage-your-choice">Other ways to manage your choice </h2>
        <p>
            If you are unable or do not wish to use our online service, see
          <br/>
          <a href={OTHER_WAYS_TO_SET_YOUR_PREFERENCES_ENDPOINT}>other ways to manage your choice</a>.
        </p>
      </div>
    </div>
  </div>;
};

export {EnableCookiesContent};
