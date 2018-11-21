import React from 'react';
import ReactDOM from 'react-dom';
import {SET_YOUR_PREFERENCES_ENDPOINT, GENERIC_SYSTEM_ERROR_ENDPOINT, SERVICE_UNAVAIABLE_ENDPOINT,
  SESSION_EXPIRED_ENDPOINT, CONFIRMATION_DELIVERY_METHOD_ENDPOINT, CONFIRMATION_SENDER_ENDPOINT,
  THANK_YOU_ENDPOINT} from '../common/endpoints.js';
import {getCacheBustingUniqueSeed} from '../common/utils.js';
import {Loader} from '../components/loader.js';
import {get} from '../services/fetch.js';
import {PREFERENCE_CAN_NOT_TEXT, PREFERENCE_CAN_TEXT} from '../common/constants.js';

const responseEndpoints = {
  200: THANK_YOU_ENDPOINT,
  403: SESSION_EXPIRED_ENDPOINT,
  503: SERVICE_UNAVAIABLE_ENDPOINT,
  429: SERVICE_UNAVAIABLE_ENDPOINT,
  500: GENERIC_SYSTEM_ERROR_ENDPOINT
};


class ReviewYourChoice extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      'contactType': null,
      'contactValue': null,
      'sharingPreference': null,
      'disabled': false
    };

    this.setContactAndPreferences = this.setContactAndPreferences.bind(this);
    this.handleConfirmationResponse = this.handleConfirmationResponse.bind(this);
    this.retrieveUserInformation = this.retrieveUserInformation.bind(this);
    this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
  }

  setContactAndPreferences({data, status}) {
    if(status === 200) {
      let results = {
        'contactType': null,
        'contactValue': null,
        'sharingPreference': null
      };

      if (data.hasOwnProperty('email')) {
        results['contactType'] = 'email';
        results['contactValue'] = data.email;
      }

      if (data.hasOwnProperty('sms')) {
        results['contactType'] = 'sms';
        results['contactValue'] = data.sms;
      }

      if (data.preference === 'optedIn') {
        results['sharingPreference'] = PREFERENCE_CAN_TEXT;
      } else {
        results['sharingPreference'] = PREFERENCE_CAN_NOT_TEXT;
      }

      this.setState(results);
      return data;
    }
    else if (responseEndpoints.hasOwnProperty(status)) {
      let page = responseEndpoints[status];
      window.location.href = page;
    } else {
      window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
    }
  }

  retrieveUserInformation() {
    let url = CONFIRMATION_DELIVERY_METHOD_ENDPOINT + getCacheBustingUniqueSeed();
    get(url)
      .then((response) =>  {
        this.setContactAndPreferences(response);
      })
      .catch((_error) => {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
      });
  }

  handleConfirmationSubmit(event) {
    this.setState({ disabled: true });
    event.preventDefault();

    let url = CONFIRMATION_SENDER_ENDPOINT + getCacheBustingUniqueSeed();
    get(url)
      .then((response) =>  {
        this.handleConfirmationResponse(response);
      })
      .catch((_error) => {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
      });
  }

  handleConfirmationResponse({_data, status}){
    if (responseEndpoints.hasOwnProperty(status)) {
      let page = responseEndpoints[status];
      window.location.href = page;
    } else {
      window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
    }
  }

  componentDidMount() {
    this.retrieveUserInformation();
  }

  render() {
    var foundDetails = (this.state.contactType != null) && (this.state.sharingPreference != null);
    if (foundDetails) {
      return (
        <div id="holder">
          <div className="page-section">
            <h1 className="h2">Review your choice</h1>
          </div>
          <div className="page-section">
            <div className="reading-width">
              <div className="grid-row">
                <div className="column--two-thirds">
                  <form id="reviewChoicesForm" onSubmit={this.handleConfirmationSubmit} action="" >
                    <h2 id="your-choice" className="h3">Your choice</h2>
                    <p>Your confidential patient information <b>{this.state.sharingPreference}</b> be used | <a id="editChoicesLink" href={SET_YOUR_PREFERENCES_ENDPOINT} aria-label="Change preference">Change</a></p>
                    <p>We will send confirmation of your choice to {this.state.contactValue}</p>
                    <input disabled={this.state.disabled} id="reviewChoicesSubmitButton" className="button" type="submit" role="button" value="Confirm"></input>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return Loader();
    }
  }

}

ReactDOM.render(<ReviewYourChoice/>, document.getElementById('mainContent'));
