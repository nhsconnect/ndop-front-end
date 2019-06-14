import * as CommonUtils from './lambda-common-utils-ES5.js';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as AWS from 'aws-sdk';

var CONFIG = null;
var LAMBDA_CLIENT = null;
var LOGGER = null;

exports.renderer = function(event, context) {
  try {
    handle(event, context);
  }
  catch (err) {
    var stackTrace = err.stack.replace(/\n/g, '');
    LOGGER.error(`exception | lambda_progress=error | exception_type="${err.code}" | exception_value="${err.message}" | stacktrace="${stackTrace}"`);
  }
};

function handle(event, context) {

  var metaData = CommonUtils.getMetaData(event, context);
  setupLambda(metaData);

  if (CommonUtils.maintenanceModeActive()) {
    LOGGER.info('maintenance_mode_active | lambda_progress=aborting');
    var response = CommonUtils.generateServiceUnavailableResponse();
    context.succeed(response);
    return;
  }

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
    CommonUtils.retrieveSessionIdFromCookie(event, metaData);
    if (metaData.sessionId == CommonUtils.COOKIE_NOT_SET) {
      context.succeed(CommonUtils.generateUnauthorizedResponse(CONFIG));
      return;
    }
    respond(context, metaData.sessionId);
  });
}

function setupLambda(metaData) {

  LOGGER = CommonUtils.configureLogger(metaData);

  if (LAMBDA_CLIENT == null) {
    LAMBDA_CLIENT = new AWS.Lambda();
  }
}

function respond(context, sessionId) {
  var invocationData = {
    'lambdaClient': LAMBDA_CLIENT,
    'sessionId': sessionId,
    'getLambdaName': CONFIG.GET_STATE_MODEL_FUNCTION_NAME,
    'putLambdaName': CONFIG.PUT_STATE_MODEL_FUNCTION_NAME
  };

  CommonUtils.getStateModel(invocationData, (stateModel) => {
    if (stateModel == null) {
      context.fail('error=error_getting_state_model');
      return;
    }

    invocationData.stateModel = CommonUtils.cleanStateModel(stateModel, sessionId);

    CommonUtils.putStateModel(invocationData, (success) => {
      if (success == false) {
        context.fail('error=error_modifying_state_model');
        return;
      }

      var html = renderHtml(stateModel.flow);
      var response = CommonUtils.generateResponse(html, CommonUtils.HTTP_RESPONSE_OK, Object.assign(
        {},
        {'Cache-Control': 'no-cache'},
        CommonUtils.CONTENT_TYPE_TEXT_HTML_HEADER
      ));
      LOGGER.info('finished_lambda | lambda_progress=finished');
      context.succeed(response);
    });
  });
}

function renderHtml(flow) {
  LOGGER.info('rendering_html | lambda_progress=in-progress');
  var landingPageComponent = getLookupFailureComponent();
  var ComponentFactory = React.createFactory(landingPageComponent);
  var html = ReactDOMServer.renderToStaticMarkup(ComponentFactory({flow}));
  LOGGER.info('rendered_html | lambda_progress=in-progress');
  return CommonUtils.DOCTYPE_TAG + html;
}

function getLookupFailureComponent() {
  return LookupFailure;
}

class LookupFailure extends React.Component {
  render() {
    return (
      <html lang="en-GB">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta httpEquiv="X-Frame-Options" content="deny"/>
          <noscript>
            <style dangerouslySetInnerHTML={{__html: `
              html{display:none;}
            `}} />
            <meta httpEquiv="refresh" content="0.0;url=/nojs/"/>
          </noscript>
          <title>Sorry, your details do not match what we have in our records - {CONFIG.SERVICE_NAME}</title>

          <link rel="shortcut icon" type="image/x-icon" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/favicon.ico'}/>
          <link rel="apple-touch-icon" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/apple-touch-icon.png'}/>
          <link rel="icon" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/favicon.png'}/>
          <link rel="image" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/logotype-nhs-colour__reverse.png'}/>
          <link rel="stylesheet" type="text/css" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/css/nhsuk.css'} media="screen"/>
        </head>

        <body id="mainBody">
          <div className="skiplinks">
            <div className="skiplinks__inner">
              <a id="skipToContentLink" href="#mainContent" className="skiplinks__link">Skip to main content</a>
            </div>
          </div>
          <header id="header" role="banner">
            <div className="global-header">
              <div className="global-header__inner">
                <a id="headerImgLink" href={CONFIG.NHSUK_ROOT_DOMAIN} className="global-header__link">
                  <img src={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/logotype-nhs-mono.png'} alt="NHS" />
                </a>
              </div>
            </div>
            <div className="page-band">
              <div className="page-section">
                {CONFIG.SERVICE_NAME}
              </div>
            </div>
          </header>
          <main id="mainContent" role="main">
            <div className="page-section" id="page-content">
              <div className="reading-width">
                <div className="grid-row">
                  {this.props.flow === 'postcode'
                    ? <div className="column--two-thirds">
                      <h1 className="h2">Sorry, your details do not match what we have in our records</h1>
                      <p>This may be because your GP practice does not have the correct details for you.</p>
                      <p>You may be able to make your choice online by giving us your NHS number.</p>
                      <a className="button" id="goToNHSNumberRoute" href="/yourdetails#/details-nhs-number">
                        Use my NHS number
                      </a>
                      <h2 className="h3">Other ways to make your choice</h2>
                      <p>
                        You can&nbsp;
                        <a id="goToOtherWaysToSetYourPreferencesId" href={CONFIG.OTHER_WAYS_TO_SET_YOUR_PREFERENCES_ENDPOINT}>
                          make your choice by phone or by filling out a paper form.
                        </a>
                      </p>
                    </div>
                    : <div className="column--two-thirds">
                      <h1 className="h2">Sorry, your details do not match what we have in our records</h1>
                      <p>If the details you gave are correct you&apos;ll need to update your details at your GP practice
                        before you can make your choice online.</p>
                      <p>If you think you made a mistake entering your details you can try again.</p>
                      <a className="button" href="/yourdetails">
                        Try again
                      </a>
                      <h2 className="h3">Other ways to make your choice</h2>
                      <p>
                        You can&nbsp;
                        <a id="goToOtherWaysToSetYourPreferencesId" href={CONFIG.OTHER_WAYS_TO_SET_YOUR_PREFERENCES_ENDPOINT}>
                          make your choice by phone or by filling out a paper form.
                        </a>
                      </p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </main>
          <footer role="contentinfo">
            <div className="global-footer">
              <div className="global-footer__inner">
                <div>
                  <h2 className="util-visuallyhidden">Getting help using the website</h2>
                  <p>
                    <a id="accessibilityStatementFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.ACCESSIBILITY_STATEMENT_ENDPOINT}>Accessibility <span className="util-visuallyhidden"> - Page opens in new window</span></a>
                  </p>
                  <h2 className="util-visuallyhidden">Terms and conditions</h2>
                  <ul className="link-list">
                    <li><a id="privacyNoticeFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.PRIVACY_NOTICE_ENDPOINT}>Privacy notice <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                    <li><a id="termsAndConditionsFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.TERMS_AND_CONDITIONS_ENDPOINT}>Terms and conditions <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                    <li><a id="cookiePolicyFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.COOKIES_POLICY_ENDPOINT}>Cookie policy <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    );
  }
}
