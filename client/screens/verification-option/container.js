import React from 'react';
import PropTypes from 'prop-types';

import {GENERIC_SYSTEM_ERROR_ENDPOINT, REQUEST_CODE_ENDPOINT,
  CONTACT_DETAILS_NOT_RECOGNISED_ENDPOINT} from '../../common/endpoints.js';
import {ERROR_TITLE, VERIFICATION_OPTION_TITLE} from '../../common/constants.js';
import {responseEndpoints} from './endpoint-mappings.js';
import {post} from '../../services/fetch.js';
import {handleSubmitResponse} from '../../common/handlers.js';

import {Page} from './container/page.js';

export class PageContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      verificationChoice: null,
      disabled: false,
      validForm: true,
    };

    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    let hasChoice = this.state.verificationChoice ? true : false;
    this.setState({
      validForm: hasChoice,
      disabled: false
    }, hasChoice ? null : () => {
      window.location = '#mainContent';
      document.getElementById('errorBox').focus();
      document.title = ERROR_TITLE + VERIFICATION_OPTION_TITLE;
    });
    return hasChoice;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.validateForm()) {
      return;
    } if (this.state.verificationChoice == 'unrecognised'){
      window.location.href = CONTACT_DETAILS_NOT_RECOGNISED_ENDPOINT;
      return;
    }

    this.setState({ disabled: true });

    let body = {otp_delivery_type: this.state.verificationChoice};
    post(REQUEST_CODE_ENDPOINT, body)
      .then((response) =>  {
        handleSubmitResponse(response, responseEndpoints);
      })
      .catch((_error) => {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
      });
  }

  render() {

    return(
      <Page
        validForm={this.state.validForm}
        disabled={this.state.disabled}
        handleSubmit={this.handleSubmit}
        email={this.props.email}
        sms={this.props.sms}
        verificationChoice={this.state.verificationChoice}
        setVerificationChoice={(event) => {this.setState({verificationChoice: event.target.value});}}/>);
  }
}

PageContainer.propTypes = {
  email: PropTypes.string,
  sms: PropTypes.string
};

export default PageContainer;
