import * as AWS from 'aws-sdk';
import winston from 'winston';
import moment from 'moment';

let LOGGER = null;

let s3 = new AWS.S3();

const s3ConfigBucket = process.env.S3_CONFIG_BUCKET;
const environmentName = process.env.ENV_NAME;
const MAINTENANCE_MODE = '' + process.env.MAINTENANCE_MODE;

const COOKIE_NOT_SET = 'cookie_not_set';
const DOCTYPE_TAG = '<!DOCTYPE html>';
const CONTENT_TYPE_TEXT_HTML_HEADER = {'Content-Type': 'text/html'};
const CONTENT_TYPE_APPLICATION_JSON_HEADER = {'Content-Type': 'application/json'};
const RESPONSE_BODY_INTERNAL_SERVER_ERROR = '{"error": "internal_server_error"}';
const RESPONSE_BODY_PERMISSION_DENIED = '{"error": "permission_denied"}';
const RESPONSE_BODY_SERVICE_UNAVAILABLE_ERROR = '{"error": "service_unavailable"}';
const RESPONSE_BODY_QUOTA_EXCEEDED_ERROR = '{"error": "quota_exceeded"}';
const RESPONSE_BODY_SESSION_EXPIRED_ERROR = '{"error": "session_expired"}';
const HTTP_RESPONSE_OK = 200;
const HTTP_RESPONSE_BAD_REQUEST = 400;
const HTTP_RESPONSE_FORBIDDEN = 403;
const HTTP_RESPONSE_SESSION_EXPIRED = HTTP_RESPONSE_FORBIDDEN;
const HTTP_RESPONSE_NOT_FOUND = 404;
const HTTP_RESPONSE_NOT_ACCEPTABLE = 406;
const HTTP_RESPONSE_METHOD_NOT_ALLOWED = 405;
const HTTP_RESPONSE_QUOTA_EXCEEDED = 429;
const HTTP_RESPONSE_SERVER_ERROR = 500;
const HTTP_RESPONSE_SERVICE_UNAVAILABLE = 503;

const MAINTENANCE_MODE_ACTIVE = 'true';
const ENV_CONFIG_FILE_NAME = 'frontend-endpoint-env-config.json';
const REQUEST_RESPONSE = 'RequestResponse';
const SEPARATOR = ',';

const SECURITY_HEADERS = {
  'Cache-control': 'no-store',
  'Pragma': 'no-cache',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1',
  'X-Frame-Options': 'deny'
};

module.exports = {
  DOCTYPE_TAG: DOCTYPE_TAG,
  COOKIE_NOT_SET: COOKIE_NOT_SET,
  getMetaData: getMetaData,
  getCookie: getCookie,
  configureLogger: configureLogger,
  retrieveSessionIdFromCookie: retrieveSessionIdFromCookie,
  getConfig: getConfig,
  validSessionState: validSessionState,
  getStateModel: getStateModel,
  putStateModel: putStateModel,
  buildRequest: buildRequest,
  generateResponse: generateResponse,
  generateServiceUnavailableResponse: generateServiceUnavailableResponse,
  maintenanceModeActive: maintenanceModeActive,
  cleanStateModel: cleanStateModel,
  MAINTENANCE_MODE: MAINTENANCE_MODE,
  MAINTENANCE_MODE_ACTIVE: MAINTENANCE_MODE_ACTIVE,
  CONTENT_TYPE_TEXT_HTML_HEADER: CONTENT_TYPE_TEXT_HTML_HEADER,
  CONTENT_TYPE_APPLICATION_JSON_HEADER: CONTENT_TYPE_APPLICATION_JSON_HEADER,
  RESPONSE_BODY_INTERNAL_SERVER_ERROR: RESPONSE_BODY_INTERNAL_SERVER_ERROR,
  RESPONSE_BODY_PERMISSION_DENIED: RESPONSE_BODY_PERMISSION_DENIED,
  RESPONSE_BODY_SERVICE_UNAVAILABLE_ERROR: RESPONSE_BODY_SERVICE_UNAVAILABLE_ERROR,
  RESPONSE_BODY_QUOTA_EXCEEDED_ERROR: RESPONSE_BODY_QUOTA_EXCEEDED_ERROR,
  RESPONSE_BODY_SESSION_EXPIRED_ERROR: RESPONSE_BODY_SESSION_EXPIRED_ERROR,
  HTTP_RESPONSE_OK: HTTP_RESPONSE_OK,
  HTTP_RESPONSE_BAD_REQUEST: HTTP_RESPONSE_BAD_REQUEST,
  HTTP_RESPONSE_SESSION_EXPIRED: HTTP_RESPONSE_SESSION_EXPIRED,
  HTTP_RESPONSE_NOT_FOUND: HTTP_RESPONSE_NOT_FOUND,
  HTTP_RESPONSE_NOT_ACCEPTABLE: HTTP_RESPONSE_NOT_ACCEPTABLE,
  HTTP_RESPONSE_METHOD_NOT_ALLOWED: HTTP_RESPONSE_METHOD_NOT_ALLOWED,
  HTTP_RESPONSE_SERVER_ERROR: HTTP_RESPONSE_SERVER_ERROR,
  HTTP_RESPONSE_SERVICE_UNAVAILABLE: HTTP_RESPONSE_SERVICE_UNAVAILABLE,
  HTTP_RESPONSE_QUOTA_EXCEEDED: HTTP_RESPONSE_QUOTA_EXCEEDED
};

function maintenanceModeActive() {
  return MAINTENANCE_MODE_ACTIVE === MAINTENANCE_MODE.toLowerCase();
}

function generateServiceUnavailableResponse() {
  return generateResponse(
    RESPONSE_BODY_SERVICE_UNAVAILABLE_ERROR,
    HTTP_RESPONSE_SERVICE_UNAVAILABLE,
    CONTENT_TYPE_APPLICATION_JSON_HEADER,
    null);
}

function cleanStateModel(oldStateModel, oldSessionId) {
  let newData = {
    'session_id': oldSessionId,
    'state_model': {
      'session_id': oldSessionId,
      'contact_centre': oldStateModel.contact_centre,
      'expiry_time_key': oldStateModel.expiry_time_key
    }
  };
  return newData;
}

function getMetaData(event, context) {
  var functionName = context.functionName;
  var functionArn = context.invokedFunctionArn;
  var alias = functionArn.split(':').pop();

  if (alias == functionName) {
    alias = '$LATEST';
  }

  var functionVersion = context.functionVersion;
  var invocationId = context.awsRequestId;
  var apiRequestId = event.requestContext.requestId;
  var apiStage = event.requestContext.stage;
  var userAgentValue = event.requestContext.identity.userAgent;
  var headers = event.headers;
  var stringOfIpAddress = headers['X-Forwarded-For'];
  var sourceIpAddress = getFirstIpAddress(stringOfIpAddress);
  var userAgent = '"'+userAgentValue+'"';

  var metaData = {
    'functionName': functionName,
    'functionAlias': alias,
    'functionVersion': functionVersion,
    'apiStage': apiStage,
    'apiRequestId': apiRequestId,
    'invocationId': invocationId,
    'sourceIpAddress': sourceIpAddress,
    'userAgent': userAgent,
    'sessionId': COOKIE_NOT_SET
  };

  return metaData;
}

function configureLogger(metaData) {
  LOGGER = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: function() {
          return moment().format('DD-MM-YYYY HH:mm:ss.SSSS');
        },
        formatter: function(options) {
          return `time=${options.timestamp()} \
          | log_level=${options.level.toUpperCase()} \
          | message=${(options.message ? options.message : '')} \
          | environment=${environmentName} \
          | function_name=${metaData.functionName} \
          | function_alias=${metaData.functionAlias} \
          | function_version=${metaData.functionVersion} \
          | api_stage=${metaData.apiStage} \
          | api_request_id=${metaData.apiRequestId} \
          | invocation_id=${metaData.invocationId} \
          | source_ip_address=${metaData.sourceIpAddress} \
          | user_agent=${metaData.userAgent} \
          | session_id=${metaData.sessionId}`;
        }
      })
    ]
  });

  return LOGGER;
}

function getCookie(event, cookieName) {
  LOGGER.info(`getting_cookie | cookie_name=${cookieName} | lambda_progress=in-progress`);
  try {
    var cookies = event.headers.Cookie.split(';');
    for (var cookie in cookies) {
      var cookie_parts = cookies[cookie].split('=');
      if (cookie_parts[0].trim() === cookieName) {
        return cookie_parts[1];
      }
    }
    return null;
  }
  catch(err) {
    LOGGER.info(`failed_to_get_cookie | cookie_name=${cookieName} | exception="${err}" | lambda_progress=in-progress`);
    return null;
  }
}

function retrieveSessionIdFromCookie(event, metaData) {
  LOGGER.info('loading_session_id_from_cookie | lambda_progress=in-progress');
  let sessionId = getCookie(event, 'session_id');
  if (sessionId) {
    metaData.sessionId = sessionId;
    LOGGER.info('loaded_session_id_from_cookie | lambda_progress=in-progress');
  } else {
    LOGGER.info('session_id_cookie_not_present | failed_task=retrieveSessionIdFromCookie | lambda_progress=in-progress');
  }
}

function getConfig(alias, callback) {

  LOGGER.info(`fetching_config_in_cold_lambda | alias=${alias} | lambda_progress=in-progress`);
  var configFileKey = alias + '/' + ENV_CONFIG_FILE_NAME;

  var s3_params = {
    Bucket: s3ConfigBucket,
    Key: configFileKey
  };

  s3.getObject(s3_params, function (err, data) {
    if (err) {
      LOGGER.error(`error | failed_task=fetch_config_in_cold_lambda | error_message="Unable to fetch config from s3" | alias=${alias} | exception="${err}" | lambda_progress=error`);
      callback(null, err);
    } else {
      var retrievedConfig = JSON.parse(data.Body);
      callback(retrievedConfig, null);
    }
  });
}

function validSessionState(sessionValidationData, callback) {
  var checkStateModel = sessionValidationData.checkStateModel;

  var params = {
    FunctionName: checkStateModel,
    InvocationType: REQUEST_RESPONSE,
    Payload: JSON.stringify({'session_id': sessionValidationData.sessionId})
  };

  LOGGER.info(`validating_session_id | target_lambda=${checkStateModel} | lambda_progress=in-progress`);
  sessionValidationData.lambdaClient.invoke(params, (err, data) => {
    if (err) {
      LOGGER.error(`error | failed_task=validating_session_id | error_message="Unable to invoke target lambda" | target_lambda=${checkStateModel}| exception="${err}" | lambda_progress=error`);
      callback(false);
    }
    else {
      var parsedPayload = JSON.parse(JSON.parse(data.Payload));
      if (parsedPayload.exists !== true) {
        LOGGER.info('no_state_model_for_session_id | lambda_progress=in-progress');
        callback(false);
      }

      LOGGER.info('state_model_exists_for_session_id | lambda_progress=in-progress');
      callback(true);
    }
  });
}

function getStateModel(invocationData, callback){
  var lambdaName = invocationData.getLambdaName;

  var params = buildRequest(lambdaName, {'session_id': invocationData.sessionId});

  LOGGER.info(`getting_state_model | target_lambda=${lambdaName} | lambda_progress=in-progress`);
  invocationData.lambdaClient.invoke(params, (err, data) => {
    if (err) {
      LOGGER.error(`error | failed_task=getting_state_model | error_message="Unable to invoke target lambda" | target_lambda=${lambdaName} | exception="${err}" | lambda_progress=error`);
      callback(null);
    }
    else {
      var parsedPayload = JSON.parse(data.Payload);
      var statusCode = data.StatusCode;
      if (statusCode != 200) {
        LOGGER.info(`no_state_model_for_session_id | target_lambda=${lambdaName} | status_code=${statusCode} | lambda_progress=in-progress`);
        callback(null);
      }
      LOGGER.info('got_state_model | lambda_progress=in-progress');
      callback(parsedPayload);
    }
  });
}

function putStateModel(invocationData, callback){
  var lambdaName = invocationData.putLambdaName;

  var params = buildRequest(lambdaName, invocationData.stateModel);

  LOGGER.info(`modify_state_model | target_lambda=${lambdaName} | lambda_progress=in-progress`);
  invocationData.lambdaClient.invoke(params, (err, data) => {
    if (err) {
      LOGGER.error(`error | failed_task=modify_state_model | error_message="Unable to invoke target lambda" | target_lambda=${lambdaName} | exception="${err}" | lambda_progress=error`);
      callback(false);
    }
    else {
      var statusCode = data.StatusCode;
      if (statusCode != 200) {
        LOGGER.error(`error | failed_task=modify_state_model |error_message="Could not modify state model" | target_lambda=${lambdaName} | exception="${err}" | status_code=${statusCode} | lambda_progress=error`);
        callback(false);
      }
      LOGGER.info('modified_state_model | lambda_progress=in-progress');
      callback(true);
    }
  });
}

function buildRequest(lambdaName, jsonPayload){
  return {
    FunctionName: lambdaName,
    InvocationType: REQUEST_RESPONSE,
    Payload: JSON.stringify(jsonPayload)
  };
}

function generateResponse(body, statusCode, app_headers) {
  LOGGER.info(`generating_response | status_code=${statusCode} | lambda_progress=finished`);
  const headers = Object.assign({}, app_headers, SECURITY_HEADERS);
  return {
    statusCode: statusCode,
    body: body,
    headers: headers
  };
}

function getFirstIpAddress(stringOfIpAddress) {
  if(stringOfIpAddress && stringOfIpAddress.trim()){
    var arrayOfStrings = stringOfIpAddress.split(SEPARATOR);
    return arrayOfStrings[0];
  }else{
    return 'not-set';
  }
}
