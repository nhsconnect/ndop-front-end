import { NDOP_SEEN_COOKIE_MESSAGE, APP_JSON_TYPE} from './constants.js';

function getCacheBustingUniqueSeed() {
  let url_unique_seed = '';
  try {
    url_unique_seed = Date.now();
  }
  catch(err) {
    url_unique_seed = Math.floor((Math.random() * 100000) + 1);
  }
  let url_postfix = '?unique_seed=' + url_unique_seed;
  return url_postfix;
}

function fadeIn(elementId) {
  let element = document.querySelector(elementId);
  let op = 0;
  let timer = setInterval(function () {
    if (op >= 1){
      clearInterval(timer);
    }
    element.style.opacity = op;
    op += 0.01;
  }, 20);
}

function getAttributeFromDOM(attributeName) {
  let containerElement = document.getElementById('mainContent');
  let namedItem = containerElement.attributes.getNamedItem(attributeName);

  if (namedItem) {
    return namedItem.value;
  } else {
    return null;
  }
}

function parseJSON({contentTypeHeader, response}) {
  if (contentTypeHeader && contentTypeHeader.indexOf(APP_JSON_TYPE) !== -1) {
    return response.json().then(json => {
      return {
        data: json,
        status: response.status
      };
    });
  } else {
    return {
      data: {},
      status: response.status
    };
  }
}

function getCookie(cookieName) {
  try {
    let cookies = document.cookie.split(';');
    for (let cookie in cookies) {
      let cookie_parts = cookies[cookie].split('=');
      if (cookie_parts[0].trim() === cookieName) {
        return cookie_parts[1];
      }
    }
  }
  catch(err) {
    return;
  }
}

function isFirstVisit() {
  if (getCookie(NDOP_SEEN_COOKIE_MESSAGE)) {
    return false;
  }
  return true;
}

function addCookie(cookieName, cookieValue) {
  let expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);
  document.cookie = `${cookieName}=${cookieValue}; secure; expires=${expiryDate.toUTCString()}`;
}

export {
  getCacheBustingUniqueSeed,
  fadeIn,
  getAttributeFromDOM,
  parseJSON,
  isFirstVisit,
  addCookie,
};
