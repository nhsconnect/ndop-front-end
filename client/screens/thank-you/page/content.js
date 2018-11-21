import React from 'react';
import PropTypes from 'prop-types';

const OptInContent = () => {
  return <div id="shared">
    <p>Your confidential patient information can be used to help improve health and care services for the future.</p>
    <h2 className="h3" id="what-happens-next">What happens next</h2>
    <p>If you have previously opted out of using your confidential patient information, it can take up to 21 days before your opt-out is withdrawn.</p>
    <p>You can update your choice at any time in the future using this service.</p>
  </div>;
};

const OptOutContent = () => {
  return <div id="not-shared">
    <p>Your confidential patient information will not be used for research and planning.</p>
    <h2 className="h3" id="what-happens-next">What happens next</h2>
    <p>It can take up to 21 days before your decision can be applied to future data releases leaving the NHS. Your choice will be applied gradually across all organisations that use patient health information.</p>
    <p>Your choice will be acknowledged by other organisations that use health and social care information by March 2020.</p>
    <p>You can update your choice at any time in the future using this service.</p>
  </div>;
};

const Content = (props) => {
  if (props.preference == 'optedIn')
    return <OptInContent/>;

  if (props.preference == 'optedOut')
    return <OptOutContent/>;
};

export {
  Content
};


Content.propTypes = {
  preference: PropTypes.string.isRequired,
};
