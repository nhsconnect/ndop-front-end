import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {HashLink as Link} from 'react-router-hash-link';

import { Section } from '../../../components/page-composition/section';
import { ErrorBox } from '../../../components/page-composition/error-box';
import { ERROR_TITLE, DETAILS_NHS_NUMBER_TITLE, HASH_ROUTES } from '../../../common/constants';
import {inputFocus} from '../../../common/error-handling';


class DetailsNHSNumber extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      validForm: true,
      nhsNumber: props.nhsNumber || '',
      nhsNumberErrorMessage: '',
      nhsNumberErrorMessageDetailed: '',
    };

    this.validateForm = this.validateForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkLength = this.checkLength.bind(this);
    this.goBack = props.goBack.bind(this);
  }

  handleInput(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  checkLength(){
    let value = this.state.nhsNumber.replace(/\s/g, '');
    let valid = (value.toString().length == 10) && (/^\d+$/.test(value));
    return valid;
  }

  isLikeNationalInsuranceNumber(){
    let value = this.state.nhsNumber.replace(/\s/g, '');
    return (/^\D{2}\d{6}\D$/.test(value))
  }

  validateForm(){

    if(!this.state.nhsNumber){
      this.setState({nhsNumberErrorMessage: 'Enter your NHS number', nhsNumberErrorMessageDetailed: 'Enter your NHS number' });
    }
    else if(this.isLikeNationalInsuranceNumber()){
      this.setState({nhsNumberErrorMessage: "We think you've entered a National Insurance number. You need to enter your NHS number", nhsNumberErrorMessageDetailed: "We think you've entered a National Insurance number. You need to enter your NHS number" });
    }
    else if(isNaN(this.state.nhsNumber.replace(/\s/g, ''))){
      this.setState({nhsNumberErrorMessage: 'Your NHS number should not contain letters', nhsNumberErrorMessageDetailed: 'Your NHS number should not contain letters' });
    }
    else if(this.state.nhsNumber.replace(/\s/g, '').toString().length > 10){
      this.setState({nhsNumberErrorMessage: 'Your NHS number is too long', nhsNumberErrorMessageDetailed: 'Your NHS number is too long' });
    }
    else if(this.state.nhsNumber.replace(/\s/g, '').toString().length < 10){
      this.setState({nhsNumberErrorMessage: 'Your NHS number is too short', nhsNumberErrorMessageDetailed: 'Your NHS number is too short' });
    }


    let validForm = (!!this.state.nhsNumber) && this.checkLength();
    this.setState({validForm: validForm});

    if (validForm) {
      this.props.updateState({ 'nhsNumber': this.state.nhsNumber }, {
        nhsNumber: true
      });
    } else {
      this.focusOnErrorBox();
    }
    return validForm;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validateForm()) {
      this.props.history.push(HASH_ROUTES.review);
    }
  }

  componentDidMount() {
    document.title = DETAILS_NHS_NUMBER_TITLE;

    let valid = !!this.props.validForms.name && !!this.props.validForms.dob;
    if (!valid) {
      this.props.history.push('/');
    } else {
      this.props.updateState({ 'fromReviewPage': false });
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
    document.title = ERROR_TITLE + DETAILS_NHS_NUMBER_TITLE;
  }

  render() {
    return (
      <Section>
        <div className='column--two-thirds'>
          <ErrorBox title='There is a problem' validForm={this.state.validForm}>
            <li id='nhs-number-error-link' className={this.state.validForm ? 'util-displaynone' : '' }>
              <Link to='#nhsNumberContainer' id='nhsNumberInputLink' name='nhsNumberContainer' onClick={inputFocus}>{this.state.nhsNumberErrorMessage}</Link>
            </li>
          </ErrorBox>
          <form onSubmit={this.handleSubmit}>
            <div id='nhs-number' className={this.state.validForm ? '' : 'form-row-error-active has-error'}>
              <h1 className='h2'>
                <label htmlFor='nhs-number-input'>Enter your NHS Number</label>
              </h1>
              <div className='grid-row'>
                <div id='nhsNumberContainer' className='column--three-quarters field-container' tabIndex='-1'>
                  <span className='form-label__hint'>This is a 10 digit number, like 485 777 3456</span>
                  <p className={this.state.validForm ? 'util-displaynone' : 'error error-message error-label error-text error-message-active'} id='nhs-number-error'>
                    {this.state.nhsNumberErrorMessageDetailed}
                  </p>
                  <input className='-small form-control' name='nhsNumber' type='text' id='nhs-number-input'  value={this.state.nhsNumber} onChange={this.handleInput}/>
                </div>
              </div>
            </div>
            <input type='submit' className='button' id='detailsNHSNumberContinueButton' disabled={this.state.disabled} value='Continue'/>
          </form>
          <p>
            <a href="" onClick={this.goBack} id='detailsNHSNumberGoBackLink'>Go back to the previous page</a>
          </p>
        </div>
      </Section>
    );
  }
}

DetailsNHSNumber.propTypes = {
  validForms: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  nhsNumber: PropTypes.string
};

export default withRouter(DetailsNHSNumber);
