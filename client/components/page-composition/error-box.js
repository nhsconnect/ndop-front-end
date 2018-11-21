import React from 'react';
import PropTypes from 'prop-types';

const ErrorBox = (props) => {
  return <div id="errorBox"
    className={'error error-summary callout callout--error error-message ' +
      (props.validForm ? '' : 'error-message-active')}
    role="alert"
    tabIndex="-1">
    <h2 className="h3" id="error-summary">{props.title}</h2>
    <ul className="link-list" id="link-to-errors">
      {props.children}
    </ul>
  </div>;
};

ErrorBox.propTypes = {
  validForm: PropTypes.bool,
  title: PropTypes.string,
};

export {ErrorBox};
