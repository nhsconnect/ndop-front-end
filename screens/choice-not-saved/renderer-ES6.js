import * as CommonUtils from './lambda-common-utils-ES5.js';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

var LOGGER = null;
var CONFIG = null;

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
  LOGGER = CommonUtils.configureLogger(metaData);

  if (CommonUtils.maintenanceModeActive()) {
    LOGGER.info('maintenance_mode_active | lambda_progress=aborting');
    var response = CommonUtils.generateServiceUnavailableResponse();
    context.succeed(response);
    return;
  }

  LOGGER.info('starting_lambda | lambda_progress=started');
  CommonUtils.retrieveSessionIdFromCookie(event, metaData);

  var alias = metaData.functionAlias;
  if (CONFIG === null || CONFIG.ENVIRONMENT != alias) {
    CommonUtils.getConfig(alias, function (retrievedConfig, err) {
      if (err) {
        context.succeed(CommonUtils.generateResponse(
          CommonUtils.RESPONSE_BODY_INTERNAL_SERVER_ERROR,
          CommonUtils.HTTP_RESPONSE_SERVER_ERROR,
          CommonUtils.CONTENT_TYPE_APPLICATION_JSON_HEADER));
      }
      CONFIG = retrievedConfig;
      renderHtml(context);
    });
  }
  else {
    LOGGER.info('loaded_config_cached_in_warm_lambda | lambda_progress=in-progress');
    renderHtml(context);
  }
}

function renderHtml(context) {
  LOGGER.info('rendering_html | lambda_progress=in-progress');
  var expiredOtpComponent = getExpiredOtpComponent();
  var ComponentFactory = React.createFactory(expiredOtpComponent);
  var html = ReactDOMServer.renderToString(ComponentFactory());
  LOGGER.info('rendered_html | lambda_progress=in-progress');

  var response = CommonUtils.generateResponse(CommonUtils.DOCTYPE_TAG + html, CommonUtils.HTTP_RESPONSE_OK, CommonUtils.CONTENT_TYPE_TEXT_HTML_HEADER);
  LOGGER.info('finished_lambda | lambda_progress=finished');
  context.succeed(response);
}

function getExpiredOtpComponent() {
  return SetPreferenceError;
}

class SetPreferenceError extends React.Component {
  render() {
    return (
      <html lang="en-GB">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta httpEquiv="X-Frame-Options" content="deny"/>

          <title>Unable to save your choice - Find out why your NHS data matters</title>

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
          <div className="banner beta">
            <div className="page-section">
              <span>BETA</span> This is a new service - your feedback will help this service.
            </div>
          </div>
          <header id="header" role="banner">
            <div className="global-header">
              <div className="global-header__inner">
                <a id="headerImgLink" href={CONFIG.NHSUK_ROOT_DOMAIN} className="global-header__link">
                  <img src={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/logotype-nhs-mono.png'} alt="NHS"/>
                </a>
              </div>
            </div>
          </header>
          <main id="content" role="main">
            <div className="page-band">
              <div className="page-section">
                Find out why your NHS data matters
              </div>
            </div>
            <div className="page-section">
              <div className="reading-width">
                <div className="grid-row">
                  <div className="column--two-thirds">
                    <h1 className="h2">Unable to save your choice</h1>
                    <p>
                      Sorry, we were unable to save your choice.
                    </p>
                    <p>
                      This was due to an error on our behalf. Your choice has not been updated.
                    </p>
                    <p>Please try again later.</p>
                    <p>
                      <a className="button" href={CONFIG.LANDING_PAGE_ENDPOINT}>Return to the start page</a>
                    </p>
                    <h2 className="h3">Other ways to manage your choice</h2>
                    <p>You can also choose use the non-digital service instead. Please see <a href={CONFIG.OTHER_WAYS_TO_SET_YOUR_PREFERENCES_ENDPOINT}>other ways to manage your choice</a>.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <footer role="contentinfo">
            <div className="global-footer">
              <div className="global-footer__inner">
                <a id="footerImgLink" href={CONFIG.NHSUK_ROOT_DOMAIN} className="global-footer__link">
                  <img src={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/logotype-nhs-colour.png'} alt="NHS"/>
                </a>
                <div>
                  <h2 className="util-visuallyhidden">Terms and conditions</h2>
                  <ul className="link-list">
                    <li><a href={CONFIG.PRIVACY_NOTICE_ENDPOINT} target="_blank" rel="noopener noreferrer">Privacy notice<span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                    <li><a href={CONFIG.TERMS_AND_CONDITIONS_ENDPOINT} target="_blank" rel="noopener noreferrer"> Terms and conditions<span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                    <li><a href={CONFIG.COOKIES_POLICY_ENDPOINT} target="_blank" rel="noopener noreferrer">Cookie policy<span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
          <script type='text/javascript' src={CONFIG.STATIC_RESOURCES_CDN_URL + '/js/app/vendor.bundle.js'}></script>
          <script type='text/javascript' src={CONFIG.STATIC_RESOURCES_CDN_URL + '/js/app/setpreferenceerror.bundle.js'}></script>
          <script type='text/javascript' src={CONFIG.STATIC_RESOURCES_CDN_URL + '/js/lib/hotjar.js'}></script>
        </body>
      </html>
    );
  }
}
