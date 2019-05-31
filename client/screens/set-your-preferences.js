import React from 'react';
import ReactDOM from 'react-dom';
import {SET_PREFERENCE_ERROR_ENDPOINT, SERVICE_UNAVAIABLE_ENDPOINT, SESSION_EXPIRED_ENDPOINT,
  SET_PREFERENCES_ENDPOINT, REVIEW_YOUR_CHOICE_ENDPOINT, GET_PREFERENCE_RESULT_ENDPOINT} from '../common/endpoints.js';
import {fadeIn, getCacheBustingUniqueSeed} from '../common/utils.js';
import {get, post} from '../services/fetch.js';
import {Loader} from '../components/loader.js';
import {RadioButton} from '../components/buttons/radio-button.js';
import {POLL_DELAY_MILLIS, MAX_TIMEOUTS, MAX_RETRIES, ERROR_TITLE,
  SET_YOUR_PREFERENCES_TITLE} from '../common/constants.js';

/* also uses 206 for "keep polling" */
const responseEndpoints = {
  200: REVIEW_YOUR_CHOICE_ENDPOINT,
  403: SESSION_EXPIRED_ENDPOINT,
  503: SERVICE_UNAVAIABLE_ENDPOINT,
  429: SERVICE_UNAVAIABLE_ENDPOINT,
  401: SET_PREFERENCE_ERROR_ENDPOINT,
  500: SET_PREFERENCE_ERROR_ENDPOINT
};

class SetPreferences extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      preference: null,
      current_pref_text: null,
      validForm: true,
      disabled: false,
      getPrefSuccess: false
    };

    this.handleOption = this.handleOption.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.getPreferenceResult = this.getPreferenceResult.bind(this);
    this.handlePollResponse = this.handlePollResponse.bind(this);
    this.handleSubmitResponse = this.handleSubmitResponse.bind(this);
    this.updateStateOnSuccess = this.updateStateOnSuccess.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.poll = this.poll.bind(this);
  }

  handleOption(event) {
    this.setState({
      preference: event.target.value,
      disabled: false
    });
  }

  validateForm() {
    var valid = this.state.preference != null;
    this.setState({
      validForm: valid
    }, valid ? null : () => {
      window.location = '#mainContent';
      document.getElementById('errorBox').focus();
      document.title = ERROR_TITLE + SET_YOUR_PREFERENCES_TITLE;
    });
    return valid;
  }

  getPreferenceResult(){
    let url = GET_PREFERENCE_RESULT_ENDPOINT + getCacheBustingUniqueSeed();
    get(url)
      .then((response) =>  {
        this.handlePollResponse(response);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          let remainingTimeouts = this.state.remainingTimeouts -1;
          this.setState({
            remainingTimeouts: remainingTimeouts
          }, () => {setTimeout(this.poll, POLL_DELAY_MILLIS);});
        }
        else{
          window.location.href = SET_PREFERENCE_ERROR_ENDPOINT;
        }
      });
  }

  handlePollResponse({data, status}){

    if (status === 200) {
      this.setState({
        getPrefSuccess: true
      }, () => {this.updateStateOnSuccess(data);});
      return;
    }
    else if (status === 206) {
      let remainingRetries = this.state.remainingRetries -1;
      this.setState({
        remainingRetries: remainingRetries
      }, () => {setTimeout(this.poll, POLL_DELAY_MILLIS);});
      return;
    }

    if (responseEndpoints.hasOwnProperty(status)) {
      window.location.href = responseEndpoints[status];
      return;
    }

    window.location.href = SET_PREFERENCE_ERROR_ENDPOINT;
  }

  updateStateOnSuccess(data) {
    let elementId = '#existing-preference';
    if (data.hasOwnProperty('opted_out') && data.opted_out === 'active'){
      this.setState({
        preference: 'no',
        current_pref_text: 'do not allow'
      }, () => {fadeIn(elementId);});
    }
    else if (data.hasOwnProperty('opted_out') && data.opted_out === 'inactive'){
      this.setState({
        preference: 'yes',
        current_pref_text: 'allow'
      }, () => {fadeIn(elementId);});
    }
  }

  handleSubmitResponse({_data, status}){
    if (responseEndpoints.hasOwnProperty(status)) {
      var page = responseEndpoints[status];
      window.location.href = page;
    } else {
      window.location.href = SET_PREFERENCE_ERROR_ENDPOINT;
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.validateForm()){
      return;
    }

    this.setState({disabled: true});

    let body = {preference: (this.state.preference == 'yes') ? 'optedIn': 'optedOut'};
    post(SET_PREFERENCES_ENDPOINT, body)
      .then((response) =>  {
        this.handleSubmitResponse(response);
      })
      .catch((_error) => {
        window.location.href = SET_PREFERENCE_ERROR_ENDPOINT;
      });
  }

  poll() {
    if (this.state.remainingRetries > 0 && this.state.remainingTimeouts > 0){
      this.getPreferenceResult();
      return;
    }
    window.location.href = SET_PREFERENCE_ERROR_ENDPOINT;
  }

  startPolling() {
    this.setState({
      remainingTimeouts: MAX_TIMEOUTS,
      remainingRetries: MAX_RETRIES,
    }, () => {this.poll();});
  }

  componentDidMount() {
    this.startPolling();
  }

  render() {
    let radioButtonSharedProps = {
      onChange: this.handleOption,
      name: 'single-pref',
      'labelClassName': 'form-label form-label--radio multiple-choice--radio'
    };

    if (this.state.getPrefSuccess == true) {
      return (
        <div>
          <div className="page-section">
            <div className="reading-width">
              <div className="grid-row">
                <div className="column--two-thirds">
                  <div className="reading-width">
                    <div id="errorBox" className={'error error-summary callout callout--error error-message ' + (this.state.validForm ? '' : 'error-message-active')} role="alert" tabIndex="-1">
                      <h2 className="h3" id="error-summary">There is a problem</h2>
                      <ul className="link-list" id="link-to-errors">
                        <li id="" className={this.state.validForm ? 'util-displaynone' : ''}>
                          <a id="setPreferencesInputLink" href="#preference">Select your choice</a>
                        </li>
                      </ul>
                    </div>
                    { (this.state.current_pref_text) ?
                      (
                        <div className="alert alert-info" role="alert" id="existing-preference"><p>Your current choice: you <b>{this.state.current_pref_text}</b> the use of your confidential patient information.</p></div>
                      )
                      : ''
                    }

                    <h1 className="h2">Make your choice</h1>

                    <p>Your confidential patient information can be used for improving health, care and services, including:</p>
                    <ul>
                      <li>planning to improve health and care services</li>
                      <li>research to find a cure for serious illnesses</li>
                    </ul>
                    <p>Your decision will not affect your individual care and you can change your mind anytime you like.</p>

                    <form className="form" id="setPreferencesForm" onSubmit={this.handleSubmit} action="" >
                      <fieldset id="preference" className={'form-group form-row util-no-margin ' + (this.state.validForm ? '' : 'form-row-error-active has-error')} >
                        <legend className='h3'>I allow my confidential patient information to be used for research and planning:</legend>
                        <div id="single-question-input-error" className={'error error-message ' + (this.state.validForm ? '' : 'error-message-active')}>
                          <p className={"error-text"  + (this.state.validForm ? '' : ' error-label')}>Select your choice</p>
                        </div>
                        <RadioButton {...radioButtonSharedProps} id="single-opted-in" value="yes" checked={this.state.preference === 'yes'} labelText="Yes" labelId="label-for-single-opted-in"/>
                        <RadioButton {...radioButtonSharedProps} id="single-opted-out" value="no" checked={this.state.preference === 'no'} labelText="No" labelId="label-for-single-opted-out"/>
                      </fieldset>
                      <input disabled={this.state.disabled} id="setPreferencesSubmitButton" className="button" type="submit" role="button" value="Continue"></input>
                    </form>
                  </div>
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

ReactDOM.render(<SetPreferences/>, document.getElementById('mainContent'));
