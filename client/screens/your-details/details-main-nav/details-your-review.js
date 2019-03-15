import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import {Section} from '../../../components/page-composition/section';
import {DescriptionList} from '../../../components/page-composition/description-list';
import { REVIEW_YOUR_DETAILS_TITLE, HASH_ROUTES } from '../../../common/constants';
import {
  AGE_RESTRICTION_ERROR_ENDPOINT, DETAILS_ENDPOINT, GENERIC_SYSTEM_ERROR_ENDPOINT,
  SERVICE_UNAVAIABLE_ENDPOINT,
  SESSION_EXPIRED_ENDPOINT,
  VERIFICATION_OPTION_ENDPOINT
} from '../../../common/endpoints';
import {getCacheBustingUniqueSeed} from '../../../common/utils';
import {post} from '../../../services/fetch';

const responseEndpoints = {
  200: VERIFICATION_OPTION_ENDPOINT,
  403: SESSION_EXPIRED_ENDPOINT,
  503: SERVICE_UNAVAIABLE_ENDPOINT,
  429: SERVICE_UNAVAIABLE_ENDPOINT,
  406: AGE_RESTRICTION_ERROR_ENDPOINT
};

class DetailsYourReview extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();

    let url = DETAILS_ENDPOINT + getCacheBustingUniqueSeed();
    let nhsNumber = (this.props.nhsNumber && this.props.nhsNumber.replace(/\s/g, ''));

    let body = {
      firstName: this.props.firstName.trim(),
      lastName: this.props.lastName.trim(),
      dateOfBirthDay: this.props.dateOfBirthDay.replace(/\s/g, ''),
      dateOfBirthMonth: this.props.dateOfBirthMonth.replace(/\s/g, ''),
      dateOfBirthYear: this.props.dateOfBirthYear.replace(/\s/g, ''),
      nhsNumber: nhsNumber,
      postcode: this.props.postcode,
    };

    post(url, body)
      .then((response) => {
        this.handleSubmitResponse(response);
      })
      .catch((_error) => {
        window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
      });
  }

  handleSubmitResponse({_data, status}) {
    if (responseEndpoints.hasOwnProperty(status)) {
      const page = responseEndpoints[status];
      window.location.href = page;
    } else {
      window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
    }
  }

  componentDidMount() {
    document.title = REVIEW_YOUR_DETAILS_TITLE;

    let valid = !!this.props.validForms.name && !!this.props.validForms.dob
      && (!!this.props.validForms.nhsNumber || !!this.props.validForms.postcode);

    if(!valid) {
      this.props.history.push('/');
    } else {
      this.props.updateState({ 'fromReviewPage': true });
    }
  }

  render() {
    return (
      <Section>
        <div className="column--two-thirds">
          <div className="reading-width">
            <h1 className="h2">Review your details</h1>

            <div className="">
              <h2 className="h3" id="review-your-details">Your details</h2>
              <DescriptionList id={'your-name'} question={'Your name'} answer={this.props.firstName + ' ' + this.props.lastName} route={HASH_ROUTES.name}/>
              <DescriptionList id={'your-dob'} question={'Your date of birth'} answer={this.props.dateOfBirthDay + ' ' +
                this.props.dateOfBirthMonth + ' ' + this.props.dateOfBirthYear} route={HASH_ROUTES.dob}/>
              {this.props.nhsNumber &&
                <DescriptionList id={'your-nhsnumber'} question={'Your NHS Number'} answer={this.props.nhsNumber}
                  route={HASH_ROUTES.nhsNumber}/>
              }
              {!this.props.nhsNumber && this.props.postcode &&
                <DescriptionList id={'your-postcode'} question={'Your postcode'} answer={this.props.postcode}
                  route={HASH_ROUTES.postcode}/>
              }
            </div>

            <form id="yourDetailsReview" onSubmit={this.handleSubmit} action=''>
              <p>
                This information will be used to find your contact details in our database. Once a match has been found, we
                will send you a one-time verification code.
              </p>
              <p>
                You agree to let us search for your details in our database, so that we can send you a one-time security passcode.
              </p>
              <input type="submit" className="button" id="detailsReviewContinueButton" value="Agree and submit"/>
            </form>
          </div>
        </div>
      </Section>
    );
  }
}

DetailsYourReview.propTypes = {
  validForms: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  dateOfBirthDay: PropTypes.string,
  dateOfBirthMonth: PropTypes.string,
  dateOfBirthYear: PropTypes.string,
  nhsNumber: PropTypes.string,
  postcode:PropTypes.string
};

export default withRouter(DetailsYourReview);
