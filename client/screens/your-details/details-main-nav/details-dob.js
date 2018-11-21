import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {HashLink as Link} from 'react-router-hash-link';

import { Section } from '../../../components/page-composition/section';
import { ErrorBox } from '../../../components/page-composition/error-box';
import { ERROR_TITLE, DETAILS_DOB_TITLE, HASH_ROUTES } from '../../../common/constants.js';
import {inputFocus} from '../../../common/error-handling';

class DetailsDOB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validForm: true,
      validFields: {
        'dateOfBirthDay': true,
        'dateOfBirthMonth': true,
        'dateOfBirthYear': true
      },
      'dateOfBirthDay': props.dateOfBirthDay || '',
      'dateOfBirthMonth': props.dateOfBirthMonth || '',
      'dateOfBirthYear': props.dateOfBirthYear || ''
    };

    this.validateForm = this.validateForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goBack = props.goBack.bind(this);
  }

  handleInput(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  checkLength(field){
    let valid = false;
    var value = this.state[field].replace(/\s/g, '');
    var validLength = ( {
      'dateOfBirthDay': 2,
      'dateOfBirthMonth': 2,
      'dateOfBirthYear': 4
    } )[field];
    if(field == 'dateOfBirthDay' || field == 'dateOfBirthMonth'){
      valid = (value.toString().length <= validLength)
      && (/^\d+$/.test(value));
    } else {
      valid = (value.toString().length == validLength)
      && (/^\d+$/.test(value));
    }
    return valid;
  }

  validateForm(){
    let validFields = this.state.validFields;
    for (var field in validFields) {
      validFields[field] = (!!this.state[field]) && this.checkLength(field);
    }
    let validForm = Object.values(validFields).every(item => item == true);
    let fields = {
      'dateOfBirthDay': this.state.dateOfBirthDay,
      'dateOfBirthMonth': this.state.dateOfBirthMonth,
      'dateOfBirthYear': this.state.dateOfBirthYear
    };

    this.setState({validForm: validForm, validFields: validFields});

    if (validForm) {
      this.props.updateState(fields, {
        dob: true
      });
    } else {
      this.focusOnErrorBox();
    }

    return validForm;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validateForm()) {
      if (this.props.fromReviewPage) {
        this.props.history.push(HASH_ROUTES.review);
      } else {
        this.props.history.push(HASH_ROUTES.authOption);
      }
    }
  }

  componentDidMount() {
    document.title = DETAILS_DOB_TITLE;

    let valid = !!this.props.validForms.name;
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
    document.title = ERROR_TITLE + DETAILS_DOB_TITLE;
  }

  render() {

    var validDOB = this.state.validFields.dateOfBirthDay &&
      this.state.validFields.dateOfBirthMonth && this.state.validFields.dateOfBirthYear;

    return (
      <Section>
        <div className='column--two-thirds'>
          <ErrorBox title='To use this online service, resolve the following errors' validForm={this.state.validForm}>
            <li id='dob-error-link' className={validDOB ? 'util-displaynone' : ''}>
              <Link to='#dateOfBirthDayContainer' id='dateOfBirthInputLink' name='dateOfBirthDayContainer' onClick={inputFocus}>Date of birth is missing or invalid</Link>
            </li>
          </ErrorBox>
          <form id='yourDetailsDOBForm' onSubmit={this.handleSubmit} action=''>
            <fieldset>
              <legend className='form-label'>
                <h1 className='h2'>Enter your date of birth</h1>
              </legend>
              <div className='grid-row'>
                <div className='column--two-thirds'>
                  <div className={'-date form-group form-row util-no-margin ' + (validDOB ? '' : 'form-row-error-active has-error')} id='dob'>
                    <p className={validDOB ? 'util-displaynone' : 'error error-message error-label error-text error-message-active'} id="dob-error">
                        Enter your date of birth
                    </p>
                    <span className="form-label__hint">For example, &#39;5 7 1948&#39;</span>
                    <div id='dateOfBirthDayContainer' className='field-container' tabIndex='-1'>
                      <label id='dateOfBirthDayLabel' htmlFor='dateOfBirthDay' aria-label='date of birth, day'>Day</label>
                      <input className='day form-control' id='dateOfBirthDay' name='dateOfBirthDay' type='number' value={this.state.dateOfBirthDay} onChange={this.handleInput} autoComplete='bday-day'/>
                    </div>
                    <div>
                      <label id='dateOfBirthMonthLabel' htmlFor='dateOfBirthMonth' aria-label='date of birth, month'>Month</label>
                      <input className='month form-control' id='dateOfBirthMonth' name='dateOfBirthMonth' type='number' value={this.state.dateOfBirthMonth} onChange={this.handleInput} autoComplete='bday-month'/>
                    </div>
                    <div>
                      <label id='dateOfBirthYearLabel' htmlFor='dateOfBirthYear' aria-label='date of birth, year'>Year</label>
                      <input className='year form-control' id='dateOfBirthYear' name='dateOfBirthYear' type='number' value={this.state.dateOfBirthYear} onChange={this.handleInput} autoComplete='bday-year'/>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <input type='submit' className='button' id='detailsDOBContinueButton' value='Continue'/>
          </form>
          <p>
            <a href="" onClick={this.goBack} id='detailsDOBGoBackLink'>Go back</a>
          </p>
        </div>
      </Section>
    );
  }
}

DetailsDOB.propTypes = {
  updateState: PropTypes.func.isRequired,
  dateOfBirthDay: PropTypes.string,
  dateOfBirthMonth: PropTypes.string,
  dateOfBirthYear: PropTypes.string,
  history: PropTypes.object.isRequired,
  validForms: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  fromReviewPage: PropTypes.bool
};

export default withRouter(DetailsDOB);
