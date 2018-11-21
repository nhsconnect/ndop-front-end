import {GENERIC_SYSTEM_ERROR_ENDPOINT} from './constants.js';

function handleSubmitResponse({_data, status}, endpoints) {
  if (endpoints.hasOwnProperty(status)) {
    let page = endpoints[status];
    window.location.href = page;
  } else {
    window.location.href = GENERIC_SYSTEM_ERROR_ENDPOINT;
  }
}

export {handleSubmitResponse};
