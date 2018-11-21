import React from 'react';
import ReactDOM from 'react-dom';

import {getCacheBustingUniqueSeed, parseJSON} from '../common/utils.js';
import {RESEND_CODE_ERROR_ENDPOINT, RESEND_CODE_ENDPOINT, GENERIC_SYSTEM_ERROR_ENDPOINT,
  SESSION_EXPIRED_ENDPOINT, SERVICE_UNAVAIABLE_ENDPOINT, ENTER_YOUR_CODE_ENDPOINT} from '../common/endpoints.js';
import {CONTENT_TYPE_KEY} from '../common/constants.js';

const responseEndpoints = {
  200: ENTER_YOUR_CODE_ENDPOINT,
  403: SESSION_EXPIRED_ENDPOINT,
  406: RESEND_CODE_ERROR_ENDPOINT,
  429: SERVICE_UNAVAIABLE_ENDPOINT,
  503: SERVICE_UNAVAIABLE_ENDPOINT,
};

class ExpiredCodeError extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
    };

    this.handleResendClick = this.handleResendClick.bind(this);
    this.handleResendClickResponse = this.handleResendClickResponse.bind(this);
  }

  handleResendClick(event) {
    this.setState({ disabled: true });
    event.preventDefault();
    var full_url = RESEND_CODE_ENDPOINT + getCacheBustingUniqueSeed();
    fetch(full_url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
      },
      credentials: 'same-origin'
    })
      .then((response) => {
        let contentTypeHeader = response.headers.get(CONTENT_TYPE_KEY);
        return parseJSON({contentTypeHeader, response});
      })
      .then(this.handleResendClickResponse)
      .catch((_error) => {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
        return;
      });
  }

  handleResendClickResponse({_data, status}){
    if (responseEndpoints.hasOwnProperty(status)) {
      let page = responseEndpoints[status];
      window.location.href = page;
    }
    else {
      window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
    }
  }

  render() {
    return(
      <div className="page-section">
        <div className="reading-width">
          <div className="grid-row">
            <div className="column--two-thirds">
              <h1 className="h2">Your code has expired</h1>
              <p>
                The code you have entered has now expired. For security reasons, your code will expire after 30 minutes.
              </p>
              <p>
                You will need a new verification code.
              </p>
              <p>
                <button id="resend-code" disabled={this.state.disabled} onClick={this.handleResendClick} className="button" type="submit" value="Confirm">Receive a new code</button>
              </p>
              <h2 className="h3">Other ways to manage your choice</h2>
              <p>
                If you are having difficulties verifying your code we may be able to guide you through the service, or manage your choice on your behalf.
              </p>
              <p>
                Call: 0300 303 5678
              </p>
              <p>
                Open: 9am to 5pm Monday to Friday (excluding bank holidays).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ExpiredCodeError/>, document.getElementById('mainContent'));
