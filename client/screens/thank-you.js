import React from 'react';
import ReactDOM from 'react-dom';
import {STORE_PREFERENCES_RESULT_ENDPOINT, CHOICE_NOT_SAVED_ENDPOINT} from '../common/endpoints.js';
import {fadeIn, getCacheBustingUniqueSeed} from '../common/utils.js';
import {get} from '../services/fetch.js';
import {Loader} from '../components/loader.js';
import {POLL_DELAY_MILLIS, MAX_TIMEOUTS, MAX_RETRIES} from '../common/constants.js';

import {Page} from './thank-you/page.js';



class ThankYou extends React.Component {

  constructor(props) {
    super(props);

    this.storeSuccess = false;
    this.state = {
      'preference': null
    };

    this.getStorePreferencesResult = this.getStorePreferencesResult.bind(this);
    this.handlePollResponse = this.handlePollResponse.bind(this);
    this.poll = this.poll.bind(this);
  }

  getStorePreferencesResult(){
    let url = STORE_PREFERENCES_RESULT_ENDPOINT + getCacheBustingUniqueSeed();
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
          window.location.href = CHOICE_NOT_SAVED_ENDPOINT;
        }
      });
  }

  handlePollResponse({data, status}){
    if (status === 200) {
      this.storeSuccess = true;
      this.check(data.preference);
      this.setState({'preference': data.preference}, () =>
      {fadeIn('#flash-message');return;});
      return;
    }
    else if (status === 206) {
      let remainingRetries = this.state.remainingRetries -1;
      this.setState({remainingRetries: remainingRetries}, () =>
      {setTimeout(this.poll, POLL_DELAY_MILLIS);});
      return;
    }

    window.location.href = CHOICE_NOT_SAVED_ENDPOINT;
  }

  check(preference) {
    if (!preference ||
       !['optedIn', 'optedOut'].includes(preference)) {
      window.location.href = CHOICE_NOT_SAVED_ENDPOINT;
    }
  }

  poll() {
    if (this.state.remainingRetries > 0 && this.state.remainingTimeouts > 0){
      this.getStorePreferencesResult();
      return;
    }
    window.location.href = CHOICE_NOT_SAVED_ENDPOINT;
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
    if (this.storeSuccess == true) {
      return (
        <Page preference={this.state.preference}/>
      );
    } else {
      return Loader();
    }
  }
}

ReactDOM.render(<ThankYou/>, document.getElementById('mainContent'));
