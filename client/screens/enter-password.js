import React from 'react';
import ReactDOM from 'react-dom';
import {LANDING_PAGE_ENDPOINT, GENERIC_SYSTEM_ERROR_ENDPOINT, SERVICE_UNAVAIABLE_ENDPOINT,
  SESSION_EXPIRED_ENDPOINT, INCORRECT_PASSWORD_ERROR_ENDPOINT, VERIFY_PASSWORD_ENDPOINT} from '../common/endpoints.js';
import {addCookie, getCacheBustingUniqueSeed, isFirstVisit} from '../common/utils.js';
import {CookieBanner} from '../components/cookie-banner.js';
import {post} from '../services/fetch.js';
import {NDOP_SEEN_COOKIE_MESSAGE} from '../common/constants.js';

const responseEndpoints = {
  200: LANDING_PAGE_ENDPOINT,
  406: INCORRECT_PASSWORD_ERROR_ENDPOINT,
  403: SESSION_EXPIRED_ENDPOINT,
  503: SERVICE_UNAVAIABLE_ENDPOINT,
  429: SERVICE_UNAVAIABLE_ENDPOINT
};

class EnterPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      passwordInput: '',
      disabled: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitResponse = this.handleSubmitResponse.bind(this);
  }

  componentDidMount() {
    if (isFirstVisit()) {
      addCookie(NDOP_SEEN_COOKIE_MESSAGE, true);
      ReactDOM.render(CookieBanner(), document.getElementById('cookieBanner'));
    }
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
      let page = responseEndpoints[status];
      window.location.href = page;
    }
    else {
      window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
    }
  }

  handleSubmit(event) {
    this.setState({ disabled: true });
    event.preventDefault();

    let url = VERIFY_PASSWORD_ENDPOINT + getCacheBustingUniqueSeed();
    let body = {passwordInput: this.state.passwordInput};
    post(url, body)
      .then((response) =>  {
        this.handleSubmitResponse(response);
      })
      .catch((_error) => {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
      });
  }

  render() {
    return (
      <div className="page-section">
        <h1 className="h2">Enter Password</h1>
        <form id="passwordInputForm" onSubmit={this.handleSubmit} action="" >
          <label id="passwordInputLabel" className="form-label" htmlFor="passwordInput">Enter password</label>
          <input className="-small" id="passwordInput" name="passwordInput" type="password" value={this.state.passwordInput} onChange={this.handleInputChange}></input>
          <input disabled={this.state.disabled} id="passwordInputSubmitButton" className="button" type="submit" role="button" value="Continue"></input>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<EnterPassword/>, document.getElementById('mainContent'));
