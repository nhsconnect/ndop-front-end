import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import { HASH_ROUTES, STATE_CACHE_VERSION, STATE_CACHE_KEY } from '../../common/constants.js';
import DetailsName from './details-main-nav/details-name';
import DetailsDOB from './details-main-nav/details-dob';
import DetailsAuthOption from './details-main-nav/details-auth-option';
import DetailsNHSNumber from './details-main-nav/details-nhs-number';
import DetailsPostcode from './details-main-nav/details-postcode';
import DetailsYourReview from  './details-main-nav/details-your-review';

class DetailsMainNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validForms: {
        name: false,
        dob: false,
        nhsNumber: false,
        postcode: false
      },
      disabled: false,
      fromReviewPage: false,
      flowUsed: null,
      nhsNumberFailed: false
    };

    const cachedState = sessionStorage.getItem(STATE_CACHE_KEY);
    if (cachedState) {
      try {
        const cachedStateObject = JSON.parse(cachedState);
        if (cachedStateObject.version === STATE_CACHE_VERSION) {
          delete cachedStateObject['fromReviewPage'];
          this.state = Object.assign(this.state, cachedStateObject);
        }
      } catch (e) {
        // Ignore failures and fall back to the default state
      }
    }

    this.updateState = this.updateState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.warnBeforeNavigatingAway = this.warnBeforeNavigatingAway.bind(this);
  }

  updateState(fields, form = {}, callback = null){
    const validForms = {
      ...this.state.validForms,
      ...form
    };
    if ('postcode' in fields) {
      fields['flowUsed'] = 'postcode';
    } else if ('nhsNumber' in fields) {
      fields['flowUsed'] = 'nhsNumber';
    }
    this.setState({...fields, validForms}, () => {
      sessionStorage.setItem(STATE_CACHE_KEY, JSON.stringify({
        version: STATE_CACHE_VERSION,
        ...this.state
      }));
      callback && callback();
    });
  }

  warnBeforeNavigatingAway(e) {
    if(this.state.validForms.name) {
      // Cancel the event as stated by the standard.
      e.preventDefault();
      // Chrome requires returnValue to be set.
      e.returnValue = 'Changes that you made may not be saved.';
    }
  }

  // this method is bound in the child components, but defined here to de-dupe
  goBack(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  onSubmit() {
    window.removeEventListener('beforeunload', this.warnBeforeNavigatingAway);
  }

  onNHSNumberInvalid(callback) {
    this.updateState({nhsNumberFailed: true}, {}, callback)
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.warnBeforeNavigatingAway);

    const skipToContentLink = document.querySelector('#skipToContentLink');

    if (!skipToContentLink) return;

    skipToContentLink.addEventListener('click', () => {
      const mainContent = document.querySelector('#mainContent');
      if (mainContent) {
        mainContent.scrollIntoView();
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    });
  }

  // separate app from router

  render() {
    const sharedProps = {
      goBack: this.goBack,
      updateState: this.updateState,
      fromReviewPage: this.state.fromReviewPage,
      validForms: this.state.validForms
    };
    return (
      <HashRouter>
        <div>
          <Switch>
            <Route exact path={HASH_ROUTES.name}
              render={() => (<DetailsName
                {...sharedProps}
                firstName={this.state.firstName}
                lastName={this.state.lastName}/>)}/>
            <Route path={HASH_ROUTES.dob}
              render={() => (<DetailsDOB
                {...sharedProps}
                dateOfBirthDay={this.state.dateOfBirthDay}
                dateOfBirthMonth={this.state.dateOfBirthMonth}
                dateOfBirthYear={this.state.dateOfBirthYear}/>)}/>
            <Route path={HASH_ROUTES.authOption}
              render={() => (<DetailsAuthOption {...sharedProps}/>)}/>
            <Route path={HASH_ROUTES.nhsNumber}
              render={() => (<DetailsNHSNumber
                {...sharedProps}
                nhsNumber={this.state.nhsNumber}/>)}/>
            <Route path={HASH_ROUTES.postcode}
              render={() => (<DetailsPostcode
                {...sharedProps}
                postcode={this.state.postcode}/>)}/>
            <Route path={HASH_ROUTES.review}
              render={() => (<DetailsYourReview
                {...sharedProps}
                onSubmit={this.onSubmit}
                onNHSNumberInvalid={this.onNHSNumberInvalid}
                nhsNumberFailed={this.state.nhsNumberFailed}
                postcode={this.state.flowUsed === 'postcode' ? this.state.postcode : null}
                nhsNumber={this.state.flowUsed === 'nhsNumber' ? this.state.nhsNumber : null}
                firstName={this.state.firstName}
                lastName={this.state.lastName}
                dateOfBirthDay={this.state.dateOfBirthDay}
                dateOfBirthMonth={this.state.dateOfBirthMonth}
                dateOfBirthYear={this.state.dateOfBirthYear}/>)}/>
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default DetailsMainNav;
