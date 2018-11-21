import React from 'react';
import ReactDOM from 'react-dom';
import {GENERIC_SYSTEM_ERROR_ENDPOINT, PATIENT_SEARCH_RESULT_ENDPOINT} from '../common/endpoints.js';
import {fadeIn, getCacheBustingUniqueSeed} from '../common/utils.js';
import {setContactDetails} from '../common/state.js';
import {Loader} from '../components/loader.js';
import {PageContainer} from './verification-option/container.js';
import {responseEndpoints} from './verification-option/endpoint-mappings.js';
import {get} from '../services/fetch.js';
import {POLL_DELAY_MILLIS, MAX_TIMEOUTS, MAX_RETRIES} from '../common/constants.js';


class VerificationOption extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: null,
      sms: null
    };

    this.getPatientSearchResult = this.getPatientSearchResult.bind(this);
    this.handlePollResponse = this.handlePollResponse.bind(this);
    this.poll = this.poll.bind(this);
  }

  getPatientSearchResult(){
    let url = PATIENT_SEARCH_RESULT_ENDPOINT + getCacheBustingUniqueSeed();
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
          window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
        }
      });
  }

  handlePollResponse({data, status}) {
    if(status === 200) {
      this.searchSuccess = true;
      this.setState(setContactDetails(data.email, data.sms));
      fadeIn('#flash-message');
      return;
    } else if(status === 206) {
      let remainingRetries = this.state.remainingRetries -1;
      this.setState({
        remainingRetries: remainingRetries
      }, () => {setTimeout(this.poll, POLL_DELAY_MILLIS);});
      return;
    } if (responseEndpoints.hasOwnProperty(status)) {
      window.location.href = responseEndpoints[status];
      return;
    }

    window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
  }



  poll() {
    if (this.state.remainingRetries > 0 && this.state.remainingTimeouts > 0) {
      this.getPatientSearchResult();
      return;
    }
    window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
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

    if (this.searchSuccess) {
      return (
        <PageContainer
          email={this.state.email}
          sms={this.state.sms}/>
      );
    } else {
      return Loader();
    }
  }

}

ReactDOM.render(<VerificationOption/>, document.getElementById('mainContent'));
