import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';

import { Section } from '../../../components/page-composition/section';
import { ErrorBox } from '../../../components/page-composition/error-box';
import { ERROR_TITLE, DETAILS_POSTCODE_TITLE, HASH_ROUTES } from '../../../common/constants';
import { inputFocus } from '../../../common/error-handling';


class DetailsPostcode extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      validForm: true,
      postcode: props.postcode || ''
    };

    this.validateForm = this.validateForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validatePostcode = this.validatePostcode.bind(this);
    this.goBack = props.goBack.bind(this);
  }

  handleInput(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  validatePostcode() {
    var postcode = (this.state.postcode || '').trim();
    return !!(/^([a-zA-Z0-9\s]){2,8}$/.test(postcode));
  }

  validateForm(){
    let validForm = (!!this.state.postcode) && this.validatePostcode();
    this.setState({validForm: validForm});

    if (validForm) {
      this.props.updateState({ 'postcode': this.state.postcode.trim() }, {
        postcode: true
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
    document.title = DETAILS_POSTCODE_TITLE;

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
    document.title = ERROR_TITLE + DETAILS_POSTCODE_TITLE;
  }

  render() {
    return (
      <Section>
        <div className='column--two-thirds'>
          <ErrorBox title='To use this online service, resolve the following errors' validForm={this.state.validForm}>
            <li id='postcode-error-link' className={this.state.validForm ? 'util-displaynone' : ''}>
              <Link to='#postcodeContainer' id='postcodeInputLink' name='postcodeContainer' onClick={inputFocus}>Postcode is missing or invalid</Link>
            </li>
          </ErrorBox>
          <form onSubmit={this.handleSubmit}>
            <h1 className='h2'>
              <label htmlFor='postcode'>Enter your postcode</label>
            </h1>
            <div className='grid-row'>
              <div id='postcodeContainer' className='column--three-quarters' tabIndex='-1'>
                <div id='postcode'>
                  <div className={this.state.validForm ? 'form-row' : 'form-row form-row-error-active has-error'}>
                    <p className={this.state.validForm ? 'util-displaynone' : 'error error-message error-label error-text error-message-active'} id='postcode-error'>Please enter your postcode</p>
                    <span className="form-label__hint">For example, &#39;LS1 6AE&#39;</span>
                    <input className='-small form-control' name='postcode' type='text' id='postcode-input'  value={this.state.postcode} onChange={this.handleInput} autoComplete='postal-code'/>
                  </div>
                </div>
              </div>
            </div>
            <input type='submit' className='button' id='detailsPostcodeContinueButton' disabled={this.state.disabled} value='Continue'/>
          </form>
          <p>
            <a href="" onClick={this.goBack} id='detailsPostcodeGoBackLink'>Go back</a>
          </p>
        </div>
      </Section>
    );
  }
}

DetailsPostcode.propTypes = {
  validForms: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  postcode:PropTypes.string
};

export default withRouter(DetailsPostcode);
