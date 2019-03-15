import * as CommonUtils from './lambda-common-utils-ES5.js';

var LOGGER = null;
var CONFIG = null;

exports.renderer = function(event, context) {
  var metaData = CommonUtils.getMetaData(event, context);
  metaData.sessionId = CommonUtils.COOKIE_NOT_SET;
  LOGGER = CommonUtils.configureLogger(metaData);
  LOGGER.info('starting_lambda | lambda_progress=started');

  var alias = metaData.functionAlias;
  (function loadConfig(next) {
    if (CONFIG == null || CONFIG.ENVIRONMENT != alias) {
      CommonUtils.getConfig(alias, (retrievedConfig, err) => {
        if (err) {
          context.succeed(CommonUtils.generateResponse(
            CommonUtils.RESPONSE_BODY_INTERNAL_SERVER_ERROR,
            CommonUtils.HTTP_RESPONSE_SERVER_ERROR,
            CommonUtils.CONTENT_TYPE_APPLICATION_JSON_HEADER));
          LOGGER.info('finishing_lambda | lambda_progress=finished');
          return;
        }
        CONFIG = retrievedConfig;
        next();
      });
    }
    else {
      LOGGER.info('loaded_config_cached_in_warm_lambda | lambda_progress=in-progress');
      next();
    }
  })(function configLoaded() {
    context.succeed(CommonUtils.generateUnauthorizedResponse(CONFIG));
    LOGGER.info('finishing_lambda | lambda_progress=finished');
  });
};

