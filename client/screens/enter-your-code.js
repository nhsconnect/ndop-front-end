import React from 'react';
import ReactDOM from 'react-dom';
import {GENERIC_SYSTEM_ERROR_ENDPOINT, SERVICE_UNAVAIABLE_ENDPOINT, SESSION_EXPIRED_ENDPOINT,
  SET_YOUR_PREFERENCES_ENDPOINT, RESEND_CODE_ENDPOINT, RESEND_CODE_ERROR_ENDPOINT,
  VERIFY_CODE_ENDPOINT, INCORRECT_CODE_ERROR_ENDPOINT, EXPIRED_CODE_ERROR_ENDPOINT} from '../common/endpoints.js';
import {OTP_LENGTH} from '../common/config.js';
import {get, post} from '../services/fetch.js';
import {fadeIn, getCacheBustingUniqueSeed} from '../common/utils.js';
import {RESEND_COUNT_REACHED, ENTER_YOUR_CODE, INCORRECT_CODE, INCORRECT_OTP_ENTERED,
  NO_CODE_PROVIDED, RE_ENTER_YOUR_CODE, ENTER_YOUR_CODE_BELOW, RETRY_OTP_ENTRY,
  ERROR_TITLE, ENTER_YOUR_CODE_TITLE} from '../common/constants.js';

const responseEndpoints = {
  200: SET_YOUR_PREFERENCES_ENDPOINT,
  401: EXPIRED_CODE_ERROR_ENDPOINT,
  406: INCORRECT_CODE_ERROR_ENDPOINT,
  403: SESSION_EXPIRED_ENDPOINT,
  503: SERVICE_UNAVAIABLE_ENDPOINT,
  429: SERVICE_UNAVAIABLE_ENDPOINT,
  206: RETRY_OTP_ENTRY
};

class VerifyOtp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      enterOtpInput: '',
      validForm: true,
      resendOtpAttempted: false,
      maxOtpResendCountReached: false,
      incorrectCodeEntered: false,
      disabled: false,
      resendClickable: true,
      displayFlash: true
    };

    this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitResponse = this.handleSubmitResponse.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleResendClick = this.handleResendClick.bind(this);
    this.handleResendClickResponse = this.handleResendClickResponse.bind(this);
  }

  validateForm() {
    var valid = this.state.enterOtpInput != null && this.state.enterOtpInput && ('' + this.state.enterOtpInput).length == OTP_LENGTH;
    this.setState({
      validForm: valid,
      disabled: false,
      displayFlash: false
    }, valid ? null : () => {
      window.location = '#mainContent';
      document.getElementById('errorBox').focus();
      document.title = ERROR_TITLE + ENTER_YOUR_CODE_TITLE;
    });
    return valid;
  }

  handleInputChange(event) {
    var value = event.target.value;
    var name = event.target.name;
    this.setState(
      {[name]: value}
    );
  }

  handleSubmitResponse({_data, status}){

    if (responseEndpoints.hasOwnProperty(status)) {
      var page = responseEndpoints[status];
      if (page == RETRY_OTP_ENTRY) {
        this.setState({
          'incorrectCodeEntered': true,
          'validForm': false,
          'disabled': false,
          'displayFlash': false
        }, () => {
          window.location = '#mainContent';
          document.getElementById('errorBox').focus();
          document.title = ERROR_TITLE + ENTER_YOUR_CODE_TITLE;
        });
      } else {
        window.location.href = page;
      }
    }
    else {
      window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
    }
  }

  handleCodeSubmit(event) {
    event.preventDefault();
    this.setState({'incorrectCodeEntered': false});

    if (!this.validateForm()){
      return;
    }

    this.setState({ disabled: true });
    event.preventDefault();

    let body = {enterOtpInput: this.state.enterOtpInput.replace(/\s/g, '')};
    post(VERIFY_CODE_ENDPOINT, body)
      .then((response) =>  {
        this.handleSubmitResponse(response);
      })
      .catch((_error) => {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
      });
  }

  handleResendClick(event) {
    event.preventDefault();
    this.setState({resendClickable: false});

    if (this.state.maxOtpResendCountReached) {
      window.location.href = RESEND_CODE_ERROR_ENDPOINT;
      return;
    }

    let url = RESEND_CODE_ENDPOINT + getCacheBustingUniqueSeed();
    get(url)
      .then((response) =>  {
        this.handleResendClickResponse(response);
      })
      .catch((_error) => {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
      });
  }

  handleResendClickResponse({data, status}){
    this.setState({
      resendOtpAttempted: true,
      resendClickable: true,
      displayFlash: true
    }, () => {
      if (status === 200) {
        let flashElement = document.getElementById('flash-message');
        flashElement.focus();
        fadeIn('#flash-message');
        fadeIn('#resend-notice');
        if (data.resend_count === RESEND_COUNT_REACHED) {
          this.setState({ maxOtpResendCountReached: true });
        }
      }
      else if (status === 406) {
        window.location.href = RESEND_CODE_ERROR_ENDPOINT;
      }
      else if (responseEndpoints.hasOwnProperty(status)) {
        let page = responseEndpoints[status];
        window.location.href = page;
      }
      else {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
      }
    });
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      fadeIn('#flash-message');
    });
  }

  render() {
    var errorBoxSummary = ENTER_YOUR_CODE;
    var errorBoxMessage = NO_CODE_PROVIDED;
    var inputBoxErrorMessage = ENTER_YOUR_CODE_BELOW;
    if (this.state.incorrectCodeEntered) {
      errorBoxSummary = INCORRECT_CODE;
      errorBoxMessage = INCORRECT_OTP_ENTERED;
      inputBoxErrorMessage = RE_ENTER_YOUR_CODE;
    }
    return (
      <div id="outer-holder">
        <div className="page-section">
          <h1 className="h2">Enter your code </h1>
        </div>
        <div className="page-section">
          <div className="reading-width">
            <div className="grid-row">
              <div className="column--two-thirds">

                <div className={'alert alert-success ' + (this.state.displayFlash ? '' : 'util-displaynone')} id="flash-message" role="alert" tabIndex="-1">
                  <p>Your code has been successfully sent!</p>
                </div>
                <div className={this.state.resendOtpAttempted ? '' : 'util-displaynone'} id="resend-notice">
                  <p>We’ve resent your code to your chosen option. The code will expire in 30 minutes. Do not close this browser window or your code will also expire.</p>
                </div>
                <div id="errorBox" className={'error error-summary callout callout--error error-message ' + (this.state.validForm ? '' : 'error-message-active')} role="alert" tabIndex="-1">
                  <h2 id="error-summary" className="h3">{errorBoxSummary}</h2>
                  <ul className="link-list">
                    <li className={this.state.validForm ? 'util-displaynone' : ''}>
                      <a id="enterOtpInputLink" className="error-text" href="#code-input">{errorBoxMessage}</a>
                    </li>
                  </ul>
                </div>

                <form className="form" id="enterOtpForm" onSubmit={this.handleCodeSubmit} action="" >
                  <div id="code-input" className={'form-group form-row ' + (this.state.validForm ? '' : 'form-row-error-active')}>
                    <label id="enterOtpLabel" className="form-label" htmlFor="enterOtpInput">Enter the code received on your mobile or email</label>
                    <div className={'error error-message ' + (this.state.validForm ? '' : 'error-message-active')}>
                      <p className="error-text error-label">{inputBoxErrorMessage}</p>
                    </div>

                    <input className="-small" id="enterOtpInput" name="enterOtpInput" type="number" value={this.state.enterOtpInput} onChange={this.handleInputChange}></input>
                    <p>Didn&apos;t receive your code? <a href="#" id="resend-code" onClick={this.state.resendClickable ? this.handleResendClick : e => e.preventDefault()}>{this.state.maxOtpResendCountReached ? 'Contact us': 'Resend code'}</a></p>
                    <input disabled={this.state.disabled} id="enterOtpSubmitButton" className="button" type="submit" role="button" value="Submit"></input>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<VerifyOtp/>, document.getElementById('mainContent'));
