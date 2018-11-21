import React from 'react';
import { Transition } from 'react-transition-group';
import PropTypes from 'prop-types';

const flashFadeDuration = 2000;

const flashDefaultStyle = {
  transition: `opacity ${flashFadeDuration}ms ease-in-out`,
  opacity: 0,
};

const flashTransistionStyle = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

function flashMessage(props){
  return(
    <Transition
      in={props.showFlashMessage}
      timeout={flashFadeDuration}
      showFlash={props.showFlashMessage}
      content={props.messageContent}>
      {(showFlash, content) => (
        <div className="" style={{
          ...flashDefaultStyle,
          ...flashTransistionStyle[showFlash]
        }} >
          {content}
        </div>
      )
      }
    </Transition>
  );
}

flashMessage.propTypes = {
  showFlashMessage: PropTypes.bool,
  messageContent: PropTypes.element,
};

export {flashMessage};
