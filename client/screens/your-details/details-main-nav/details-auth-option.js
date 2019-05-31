import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {HashLink as Link} from 'react-router-hash-link';

import { Section } from '../../../components/page-composition/section';
import { ErrorBox } from '../../../components/page-composition/error-box';
import { ERROR_TITLE, DETAILS_AUTH_OPTION_TITLE, HASH_ROUTES } from '../../../common/constants.js';
import {RadioButton} from '../../../components/buttons/radio-button.js';

const choices = {
  nhsNumber : 'nhsNumber',
  postcode : 'postcode'
};

class DetailsAuthOption extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      authChoice: null,
      validForm: true
    };

    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goBack = props.goBack.bind(this);
  }

  validateForm() {
    let hasChoice = !!this.state.authChoice;
    this.setState({validForm: hasChoice}, hasChoice ? null : () => {
      this.focusOnErrorBox();
    });
    return hasChoice;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validateForm()) {
      const nextPage = this.state.authChoice === choices.nhsNumber ? HASH_ROUTES.nhsNumber : HASH_ROUTES.postcode;
      this.props.history.push(nextPage);
    }
  }

  componentDidMount() {
    document.title = DETAILS_AUTH_OPTION_TITLE;

    let valid = !!this.props.validForms.name && !!this.props.validForms.dob;
    if (!valid) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.validForm && !this.state.validForm) {
      this.focusOnErrorBox();
    }
  }

  focusOnErrorBox() {
    document.getElementById('errorBox').focus();
    document.getElementById('errorBox').scrollIntoView();
    document.title = ERROR_TITLE + DETAILS_AUTH_OPTION_TITLE;
  }

  render() {
    let radioButtonSharedProps = {
      name: 'auth',
      labelClassName: 'form-label form-label--radio multiple-choice--radio lg',
      onChange: (event) => {this.setState({authChoice: event.target.value, validForm: true});}
    };

    return (
      <Section>
        <div className='column--two-thirds'>
          <ErrorBox title='There is a problem' validForm={this.state.validForm}>
            <li id='auth-option-error-link' className={this.state.authChoice ? 'util-displaynone' : ''}>
              <Link to='#radioFormLegend' id='authOptionErrorLink'>Select yes if you know your NHS number</Link>
            </li>
          </ErrorBox>
          <form onSubmit={this.handleSubmit}>
            <fieldset id='auth-option' className={'form-group form-row util-no-margin'+ (this.state.validForm ? '' : ' form-row-error-active has-error error-message-active')}>
              <legend id='radioFormLegend'>
                <h1 className='h2'>Do you know your NHS number?</h1>
              </legend>
              <span className='form-label__hint'>This is a 10 digit number, like 485 777 3456</span>
              <span className='form-label__hint'>You can find this on any letter sent to you by the NHS, on a prescription or by logging in to a GP practice online service</span>
              <div className='radio' className={this.state.validForm ? '' : 'error error-message error-message-active'}>
                <p className={this.state.validForm ? 'util-displaynone' : 'error-text error-label'} id='auth-option-error'>
                  Select yes if you know your NHS number
                </p>
                <RadioButton {...radioButtonSharedProps}
                  id='nhs-number-journey'
                  value={choices.nhsNumber}
                  checked={this.state.authChoice === choices.nhsNumber}
                  labelText='Yes'/>
                <RadioButton {...radioButtonSharedProps}
                  id='no-nhs-number-journey'
                  value={choices.postcode}
                  checked={this.state.authChoice === choices.postcode}
                  labelText='No'/>
              </div>
            </fieldset>
            <input type='submit' className='button' id='detailsAuthOptionSubmitButton' value='Continue'/>
          </form>
          <details className='' role='group'>
            <summary role='button'>
              <span className='details__summary'>Where you can find your NHS number</span>
            </summary>
            <div className='details__content'>
              <div className='reading-width'>
                <p>
                        An NHS number is a 10 digit number, like 485 777 3456.
                </p>
                <p>You can find your NHS number by logging in to a GP practice online service or on any document sent to you by the NHS. This may include:</p>
                <ul>
                  <li>prescriptions</li>
                  <li>test results</li>
                  <li>hospital referral letters</li>
                  <li>appointment letters</li>
                </ul>
                <p>
                        You can also ask your GP practice for help if you can`t find your NHS number.
                </p>
              </div>
            </div>
          </details>
          <p>
            <a href="" onClick={this.goBack} id='detailsAuthOptionGoBackLink'>Go back to the previous page</a>
          </p>
        </div>
      </Section>
    );
  }
}

DetailsAuthOption.propTypes = {
  goBack: PropTypes.func.isRequired,
  validForms: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(DetailsAuthOption);
