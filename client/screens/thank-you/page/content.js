import React from 'react';
import PropTypes from 'prop-types';

const OptInContent = () => {
  return <div id="shared">
    <p>Your confidential patient information can be shared for research and planning.</p>
    <p>You can update your choice at any time using this service.</p>
    <h2 class="h3" id="what-happens-next-shared">More information</h2>
    <p><a href="https://your-data-matters.service.nhs.uk/privacynotice">Visit our privacy notice</a> for more information on how and when your choice will be applied.</p>
  </div>;
};

const OptOutContent = () => {
  return <div id="not-shared">
    <p>Your confidential patient information will not be shared for research and planning.</p>
    <p>You can update your choice at any time using this service.</p>
    <h2 class="h3" id="what-happens-next-shared">More information</h2>
    <p><a href="https://your-data-matters.service.nhs.uk/privacynotice">Visit our privacy notice</a> for more information on how and when your choice will be applied.</p>
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
