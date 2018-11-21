import React from 'react';
import ReactDOM from 'react-dom';
import {addCookie, getCacheBustingUniqueSeed, isFirstVisit} from '../common/utils.js';
import {get} from '../services/fetch.js';
import {CookieBanner} from '../components/cookie-banner.js';
import {LandingPageContent} from './landing-page/landing-page-content.js';
import {EnableCookiesContent} from './landing-page/enable-cookies-content.js';
import {Section} from '../components/page-composition/section.js';
import {YOUR_DETAILS_ENDPOINT, CREATE_SESSION_ENDPOINT, GENERIC_SYSTEM_ERROR_ENDPOINT,
  SERVICE_UNAVAIABLE_ENDPOINT, SESSION_EXPIRED_ENDPOINT} from '../common/endpoints.js';
import {NDOP_SEEN_COOKIE_MESSAGE, COOKIE_BANNER_ELEMENT_ID,
  MAIN_CONTENT_ELEMENT_ID} from '../common/constants.js';

const responseEndpoints = {
  200: YOUR_DETAILS_ENDPOINT,
  403: SESSION_EXPIRED_ENDPOINT,
  503: SERVICE_UNAVAIABLE_ENDPOINT,
  429: SERVICE_UNAVAIABLE_ENDPOINT
};

class LandingPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      disabled: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmitResponse = this.handleSubmitResponse.bind(this);
  }

  handleSubmitResponse({_data, status}){
    if (responseEndpoints.hasOwnProperty(status)) {
      let page = responseEndpoints[status];
      window.location.href = page;
    } else {
      window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
    }
  }

  handleClick() {
    this.setState({ disabled: true });

    let url = CREATE_SESSION_ENDPOINT + getCacheBustingUniqueSeed();
    get(url)
      .then((response) =>  {
        this.handleSubmitResponse(response);
      })
      .catch((_error) => {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
      });
  }

  cookiesEnabled() {
    let cookiesEnabled = navigator.cookieEnabled;
    this.setState({cookiesEnabled: cookiesEnabled}, () => {
      return;});
    return cookiesEnabled;
  }

  componentDidMount() {
    var cookiesEnabled = this.cookiesEnabled();

    if (cookiesEnabled) {
      if (isFirstVisit()) {
        addCookie(NDOP_SEEN_COOKIE_MESSAGE, true);
        ReactDOM.render(CookieBanner(), document.getElementById(COOKIE_BANNER_ELEMENT_ID));
      }
    }
  }

  render() {
    let cookiesEnabled = this.state.cookiesEnabled;
    let continueButtonProps = {
      disabled: this.state.disabled,
      onClick: this.handleClick
    };

    return (
      <div>
        <Section>
          <div className="column--full">

            {cookiesEnabled ? <LandingPageContent {...continueButtonProps}/> : <EnableCookiesContent/>}

          </div>
          <div className="column--three-quarters"></div>
        </Section>
      </div>
    );
  }
}

ReactDOM.render(<LandingPage/>, document.getElementById(MAIN_CONTENT_ELEMENT_ID));
