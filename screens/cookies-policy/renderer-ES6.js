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
  var html = ReactDOMServer.renderToString(ComponentFactory());
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
          <title>Cookies Policy</title>
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
                    <h1 className="h2">Cookie policy</h1>
                    <p>The &#39;Find out why your NHS data matters&#39; service puts small files (known as ‘cookies’) onto your computer to collect information about how you browse the site. Some are essential. For others you have a choice.</p>
                    <p>We use cookies to:</p>
                    <ul>
                      <li>ensure your visit is secure</li>
                      <li>check you&#39;ve seen our cookie banner</li>
                      <li>measure how you use the website, like where you click, so it can be updated and improved based on your needs</li>
                    </ul>
                    <p>You&#39;ll see a message on the site before we store a cookie on your computer.</p>
                    <p>Find out more about <a target="_blank" rel="noopener noreferrer" href="https://ico.org.uk/your-data-matters/online/cookies/">how to manage cookies<span className="util-visuallyhidden"> - Page opens in new window</span></a> <span aria-hidden="true"> (opens in new window)</span>.</p>
                    <h2 id="how-cookies-are-used">How we use cookies</h2>
                    <h3>Checking you&#39;ve seen our cookie banner</h3>
                    <p>You will see a &quot;pop-up&quot; banner when you first visit the site telling you that we use cookies. We store a cookie so that your computer knows you&#39;ve seen the banner and knows not to show it again.</p>
                    <div className="table--responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Purpose</th>
                            <th>Expires</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>ndop_seen_cookie_message</td>
                            <td>Saves a message to let us know that you&#39;ve seen our cookie message</td>
                            <td>1 month</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <h3>Measuring how you use the website</h3>
                    <p>We use &quot;Hotjar&quot; to collect information about how you use our service. For example, which buttons you click or pages you visit. We do this to make improvements to the service.</p>
                    <p>Hotjar collects this information in a way which does not personally identify you. Hotjar sets the following cookies:</p>
                    <div className="table--responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>_hjClosedSurveyInvites</td>
                            <td>Hotjar cookie. This cookie is set once a visitor interacts with a Survey invitation modal popup. It is used to ensure that the same invite does not re-appear if it has already been shown.</td>
                            <td>365 days</td>
                          </tr>
                          <tr>
                            <td>_hjDonePolls</td>
                            <td>Hotjar cookie. This cookie is set once a visitor completes a poll using the Feedback Poll widget. It is used to ensure that the same poll does not re-appear if it has already been filled in.</td>
                            <td>365 days</td>
                          </tr>
                          <tr>
                            <td>_hjMinimizedPolls</td>
                            <td>Hotjar cookie. This cookie is set once a visitor minimizes a Feedback Poll widget. It is used to ensure that the widget stays minimizes when the visitor navigates through your site.</td>
                            <td>365 days</td>
                          </tr>
                          <tr>
                            <td>_hjDoneTestersWidgets</td>
                            <td>Hotjar cookie. This cookie is set once a visitor submits their information in the Recruit User Testers widget. It is used to ensure that the same form does not re-appear if it has already been filled in.</td>
                            <td>365 days</td>
                          </tr>
                          <tr>
                            <td>_hjMinimizedTestersWidgets</td>
                            <td>Hotjar cookie. This cookie is set once a visitor minimizes a Recruit User Testers widget. It is used to ensure that the widget stays minimizes when the visitor navigates through your site.</td>
                            <td>365 days</td>
                          </tr>
                          <tr>
                            <td>_hjIncludedInSample</td>
                            <td>Hotjar cookie. This session cookie is set to let Hotjar know whether that visitor is included in the sample which is used to generate funnels.</td>
                            <td>365 days</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p>You can <a href="https://www.hotjar.com/opt-out">opt out of Hotjar cookies<span className="util-visuallyhidden"> - Page opens in new window</span></a> <span aria-hidden="true"> (opens in new window)</span>.</p>
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
                    <li><a id="privacyNoticeFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.PRIVACY_NOTICE_ENDPOINT}>Privacy notice <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                    <li><a id="termsAndConditionsFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.TERMS_AND_CONDITIONS_ENDPOINT}>Terms and conditions <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                    <li><a id="cookiePolicyFooterLink" target="_blank" rel="noopener noreferrer" href={CONFIG.COOKIES_POLICY_ENDPOINT}>Cookie policy <span className="util-visuallyhidden"> - Page opens in new window</span></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
          <script type='text/javascript' src={CONFIG.STATIC_RESOURCES_CDN_URL + '/js/lib/hotjar.js'}></script>
        </body>
      </html>
    );
  }
}
