import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';

import { Section } from '../../../components/page-composition/section';
import { ErrorBox } from '../../../components/page-composition/error-box';
import { LANDING_PAGE_ENDPOINT } from '../../../common/endpoints';
import { ERROR_TITLE, DETAILS_NAME_TITLE , HASH_ROUTES } from '../../../common/constants';
import { inputFocus } from '../../../common/error-handling';

const nameRegex = /^[a-zA-Z0-9,-.'\s]+$/;

class DetailsName extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      validForm: true,
      validFields: {
        'firstName': true,
        'lastName': true
      },
      firstName: props.firstName || '',
      lastName: props.lastName || '',
    };

    this.validateForm = this.validateForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goBack = props.goBack.bind(this);
  }

  handleInput(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  validateForm(){
    let fields = {
      'firstName': this.state.firstName,
      'lastName': this.state.lastName
    };
    let validFields = {
      'firstName': !!this.state.firstName && nameRegex.test(this.state.firstName),
      'lastName': !!this.state.lastName && nameRegex.test(this.state.lastName),
    };
    let validForm = validFields.firstName && validFields.lastName;

    this.setState({validForm: validForm, validFields: validFields });

    if (validForm) {
      this.props.updateState(fields, {
        name: true
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
        this.props.history.push(HASH_ROUTES.dob);
      }
    }
  }

  componentDidMount() {
    document.title = DETAILS_NAME_TITLE;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.validForm && !this.state.validForm) {
      this.focusOnErrorBox();
    }
  }

  focusOnErrorBox() {
    document.getElementById('errorBox').focus();
    document.getElementById('errorBox').scrollIntoView();
    document.title = ERROR_TITLE + DETAILS_NAME_TITLE;
  }

  render() {
    return (
      <Section>
        <div className='column--two-thirds'>
          <ErrorBox title='To use this online service, resolve the following errors' validForm={this.state.validForm}>
            <li id='first-name-error-link' className={this.state.validFields.firstName ? 'util-displaynone' : ''}>
              <Link to='#firstNameContainer' id='firstNameInputLink' name='firstNameContainer' onClick={inputFocus}>First name is missing</Link>
            </li>
            <li id='last-name-error-link' className={this.state.validFields.lastName ? 'util-displaynone' : ''}>
              <Link to='#lastNameContainer' id='lastNameInputLink' name='lastNameContainer' onClick={inputFocus}>Last name is missing</Link>
            </li>
          </ErrorBox>
          <form id='yourDetailsNameForm' onSubmit={this.handleSubmit} action='' >
            <fieldset>
              <legend>
                <h1 className='h2'>Enter your name</h1>
              </legend>

              <div className='grid-row'>
                <div className='column--two-thirds'>
                  <div id='firstNameContainer' tabIndex='-1' className={'field-container ' + (this.state.validFields.firstName ? '' : 'form-row-error-active has-error')}>
                    <p className={this.state.validFields.firstName ? 'util-displaynone' : 'error error-message error-text error-label error-message-active'} id='first-name-error'>
                      Enter your first name
                    </p>
                    <label id='firstNameLabel' className='form-label' htmlFor='firstName'>First name</label>
                    <input className='form-control' name='firstName' type='text' id='firstName' value={this.state.firstName} onChange={this.handleInput} autoComplete='given-name'/>
                  </div>
                  <div id='lastNameContainer' tabIndex='-1' className={this.state.validFields.lastName ? 'field-container' : 'field-container form-row-error-active has-error'}>
                    <p className={this.state.validFields.lastName ? 'util-displaynone' : 'error error-message error-text error-label error-message-active'} id='last-name-error'>
                      Enter your last name
                    </p>
                    <label id='lastNameLabel' className='form-label' htmlFor='lastName'>Last name</label>
                    <input className='form-control' name='lastName' type='text' id='lastName' value={this.state.lastName} onChange={this.handleInput}  autoComplete='family-name'/>
                  </div>
                </div>
              </div>
            </fieldset>
            <input type='submit' className='button' id='detailsNameContinueButton' value='Continue'/>
          </form>
          <p>
            <a href={this.props.fromReviewPage ? '' : LANDING_PAGE_ENDPOINT} onClick={this.props.fromReviewPage ? this.goBack: undefined} id='detailsNameGoBackLink'>Go back</a>
          </p>
        </div>
      </Section>
    );
  }
}

DetailsName.propTypes = {
  updateState: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  goBack: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  fromReviewPage: PropTypes.bool
};

export default withRouter(DetailsName);
