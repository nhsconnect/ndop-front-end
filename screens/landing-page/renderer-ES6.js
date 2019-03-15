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
  CommonUtils.retrieveSessionIdFromCookie(event, metaData);

  var alias = metaData.functionAlias;
  if (CONFIG == null || CONFIG.ENVIRONMENT != alias) {
    CommonUtils.getConfig(alias, (retrievedConfig, err) => {
      if (err) {
        context.succeed(CommonUtils.generateResponse(
          CommonUtils.RESPONSE_BODY_INTERNAL_SERVER_ERROR,
          CommonUtils.HTTP_RESPONSE_SERVER_ERROR,
          CommonUtils.CONTENT_TYPE_APPLICATION_JSON_HEADER));
        return;
      }
      CONFIG = retrievedConfig;
      respond(context);
    });
  }
  else {
    LOGGER.info('loaded_config_cached_in_warm_lambda | lambda_progress=in-progress');
    respond(context);
  }
}

function setupLambda(metaData) {

  LOGGER = CommonUtils.configureLogger(metaData);

  if (LAMBDA_CLIENT == null) {
    LAMBDA_CLIENT = new AWS.Lambda();
  }
}

function respond(context) {
  let html = renderHtml();
  let response = CommonUtils.generateResponse(html, CommonUtils.HTTP_RESPONSE_OK, CommonUtils.CONTENT_TYPE_TEXT_HTML_HEADER);
  LOGGER.info('finished_lambda | lambda_progress=finished');
  context.succeed(response);
}

function renderHtml() {
  LOGGER.info('rendering_html | lambda_progress=in-progress');
  var landingPageComponent = getLandingPageComponent();
  var ComponentFactory = React.createFactory(landingPageComponent);
  var html = ReactDOMServer.renderToStaticMarkup(ComponentFactory());
  LOGGER.info('rendered_html | lambda_progress=in-progress');
  return CommonUtils.DOCTYPE_TAG + html;
}

function getLandingPageComponent() {
  return LandingPage;
}

class LandingPage extends React.Component {
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
          <title>How to manage your choice online - {CONFIG.SERVICE_NAME}</title>
          <link rel="shortcut icon" type="image/x-icon" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/favicon.ico'}/>
          <link rel="apple-touch-icon" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/apple-touch-icon.png'}/>
          <link rel="icon" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/favicon.png'}/>
          <link rel="image" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/logotype-nhs-colour__reverse.png'}/>
          <link rel="stylesheet" type="text/css" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/css/nhsuk.css'} media="screen"/>
          <script type='text/javascript' src={CONFIG.STATIC_RESOURCES_CDN_URL + '/js/lib/polyfill-fetch.js'}></script>
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
            <div id="cookieBanner" className="banner cookie"></div>
            <div className="global-header">
              <div className="global-header__inner">
                <a id="headerImgLink" href={CONFIG.NHSUK_ROOT_DOMAIN} className="global-header__link">
                  <img src={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/logotype-nhs-mono.png'} alt="NHS"/>
                </a>
              </div>
            </div>
          </header>
          <div className="page-band">
            <div className="page-section">
              {CONFIG.SERVICE_NAME}
            </div>
          </div>
          <main id="mainContent" role="main"
            data-other-ways-endpoint={CONFIG.OTHER_WAYS_TO_SET_YOUR_PREFERENCES_ENDPOINT}
            data-static-resources-cdn={CONFIG.STATIC_RESOURCES_CDN_URL}>
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
                    <li><a id="privacyNoticeFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.PRIVACY_NOTICE_ENDPOINT}>Privacy notice <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                    <li><a id="termsAndConditionsFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.TERMS_AND_CONDITIONS_ENDPOINT}>Terms and conditions <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                    <li><a id="cookiePolicyFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.COOKIES_POLICY_ENDPOINT}>Cookie policy <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
          <script type='text/javascript' src={CONFIG.STATIC_RESOURCES_CDN_URL + '/js/app/vendor.bundle.js'}></script>
          <script type='text/javascript' src={CONFIG.STATIC_RESOURCES_CDN_URL + '/js/app/landingpage.bundle.js'}></script>
          <script type='text/javascript' src={CONFIG.STATIC_RESOURCES_CDN_URL + '/js/lib/hotjar.js'}></script>
        </body>
      </html>
    );
  }
}
