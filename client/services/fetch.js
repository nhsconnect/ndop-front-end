//abort controller close to being supported, remove pollyfill when it is
import 'abortcontroller-polyfill';
import {parseJSON} from '../common/utils.js';
import {FETCH_TIMEOUT, CONTENT_TYPE_KEY} from '../common/constants.js';

async function get (url) {
  const controller = new AbortController();
  const signal = controller.signal;
  let options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'pragma': 'no-cache',
      'cache-control': 'no-cache'
    },
    credentials: 'same-origin',
    signal: signal
  };

  setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  let response = await fetch(url, options)
    .then((response) => {
      return response;
    });

  let contentTypeHeader = await response.headers.get(CONTENT_TYPE_KEY);
  return await parseJSON({contentTypeHeader, response});
}

async function post (url, body) {
  const controller = new AbortController();
  const signal = controller.signal;
  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify(body),
    signal: signal
  };

  setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  let response = await fetch(url, options)
    .then((response) => {
      return response;
    });

  let contentTypeHeader = await response.headers.get(CONTENT_TYPE_KEY);
  return await parseJSON({contentTypeHeader, response});
}

export {
  get,
  post
};
