import * as CommonUtils from './lambda-common-utils-ES5.js';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

var CONFIG = null;
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

function respond(context) {
  var html = renderHtml();
  var response = CommonUtils.generateResponse(html, CommonUtils.HTTP_RESPONSE_OK, CommonUtils.CONTENT_TYPE_TEXT_HTML_HEADER);
  LOGGER.info('finished_lambda | lambda_progress=finished');
  context.succeed(response);
}

function renderHtml() {
  LOGGER.info('rendering_html | lambda_progress=in-progress');
  var cookiesPolicyComponent = getCookiesPolicyComponent();
  var ComponentFactory = React.createFactory(cookiesPolicyComponent);
  var html = ReactDOMServer.renderToStaticMarkup(ComponentFactory());
  LOGGER.info('rendered_html | lambda_progress=in-progress');
  return CommonUtils.DOCTYPE_TAG + html;
}

function getCookiesPolicyComponent() {
  return CookiesPolicy;
}

class CookiesPolicy extends React.Component {
  render() {
    return (
      <html lang="en-GB">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta httpEquiv="X-Frame-Options" content="deny"/>
          <title>Cookies Policy - {CONFIG.SERVICE_NAME}</title>
          <link rel="stylesheet" type="text/css" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/css/nhsuk.css'} media="screen"/>
          <link rel="shortcut icon" type="image/x-icon" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/favicon.ico'}/>
          <link rel="apple-touch-icon" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/apple-touch-icon.png'}/>
          <link rel="icon" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/favicon.png'}/>
          <link rel="image" href={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/logotype-nhs-colour__reverse.png'}/>
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
                  <img src={CONFIG.STATIC_RESOURCES_CDN_URL + '/images/logotype-nhs-mono.png'} alt="NHS"/>
                </a>
              </div>
            </div>
            <div className="page-band">
              <div className="page-section">
                {CONFIG.SERVICE_NAME}
              </div>
            </div>
          </header>
          <main className="" id="content" role="main">
            <div className="page-section">
              <div className="grid-row">
                <div className="column--two-thirds">
                  <div className="reading-width">
                    <h1 className="h2">Cookie policy</h1>
                    <p>This website puts small files called cookies onto the device you&apos;re using the website on (for example your phone).</p>
                    <p>We use cookies to:</p>
                    <ul>
                      <li>keep your visit secure</li>
                      <li>check you&apos;ve seen our cookie banner</li>
                    </ul>
                    <p>You&apos;ll see a message on the site before we store a cookie on your computer.</p>
                    <p>Find out more about <a target="_blank" rel="noopener noreferrer" href="https://ico.org.uk/your-data-matters/online/cookies/">how to manage cookies<span className="util-visuallyhidden"> - Page opens in new window</span></a> <span aria-hidden="true"> (opens in new window)</span>.</p>
                    <h2 id="how-cookies-are-used">How we use cookies</h2>
                    <h3>To keep your visit secure</h3>
                    <p>We store a temporary cookie on your device to keep your visit secure when you use our website.</p>
                    <div className="table--responsive">
                      <table>
                        <thead>
                          <tr><th>Name</th><th>Purpose</th><th>Expires</th></tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>session_id</td>
                            <td>We use this cookie to make sure it’s you that’s using the website so we can keep your visit secure</td>
                            <td>When you leave the website</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h3>To check you&apos;ve seen our cookie banner</h3>

                    <p>You will see a pop up banner when you first visit the website telling you that we use cookies.</p>

                    <p>We store a cookie so that your device knows you&apos;ve seen the banner and knows not to show it again.</p>

                    <div className="table--responsive">
                      <table>
                        <thead>
                          <tr><th>Name</th><th>Purpose</th><th>Expires</th></tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>ndop_seen_cookie_message</td>
                            <td>We use this cookie to check if you&apos;ve seen our cookie message</td>
                            <td>After 1 month</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
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
