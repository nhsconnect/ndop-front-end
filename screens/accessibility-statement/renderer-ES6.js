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
  var html = renderHtml();
  var response = CommonUtils.generateResponse(html, CommonUtils.HTTP_RESPONSE_OK, CommonUtils.CONTENT_TYPE_TEXT_HTML_HEADER);
  LOGGER.info('finished_lambda | lambda_progress=finished');
  context.succeed(response);
}

function renderHtml() {
  LOGGER.info('rendering_html | lambda_progress=in-progress');
  var accessibilityStatementComponent = getAccessibilityStatementComponent();
  var ComponentFactory = React.createFactory(accessibilityStatementComponent);
  var html = ReactDOMServer.renderToStaticMarkup(ComponentFactory());
  LOGGER.info('rendered_html | lambda_progress=in-progress');
  return CommonUtils.DOCTYPE_TAG + html;
}

function getAccessibilityStatementComponent() {
  return AccessibilityStatement;
}

class AccessibilityStatement extends React.Component {
  render() {
    return (
      <html lang="en-GB">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta httpEquiv="X-Frame-Options" content="deny"/>
          <title>Accessibility statement - {CONFIG.SERVICE_NAME}</title>
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
          <main id="mainContent" role="main">
            <div className="page-section">
              <div className="grid-row">
                <div className="column--two-thirds">
                  <div className="reading-width">
                    <h1 className="h2">Accessibility statement</h1>
                    <p>The Choose if data from your health records is shared for research and planning website is run by NHS Digital.</p>
                    <p>We want everyone to be able to use this website.</p>
                    <h2 className="h3">How accessible this website is</h2>
                    <p>We’re committed to making this website accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.</p>
                    <p>This website is fully compliant with the <a href="https://www.w3.org/TR/WCAG21/">Web Content Accessibility Guidelines version 2.1</a> AA standard.</p>
                    <p>You should be able to:</p>
                    <ul>
                      <li>change colours, contrast levels and fonts</li>
                      <li>zoom in up to 300% without the text spilling off the screen</li>
                      <li>navigate most of the website using just a keyboard</li>
                      <li>navigate most of the website using speech recognition software</li>
                      <li>listen to most of the website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver)</li>
                    </ul>
                    <h3 className="h4">Issue with Dragon NaturallySpeaking removing content from edit boxes</h3>
                    <p>For some Dragon NaturallySpeaking users the tool may delete or remove the content you’ve dictated from input fields after you click continue. If this happens use keyboard commands to continue.</p>
                    <h3 className="h4">Issue with the page refreshing if you disable JavaScript</h3>
                    <p>If you disable JavaScript the page will keep refreshing while we load or save your data:</p>
                    <ul>
                      <li>when you submit your details</li>
                      <li>when we show you your current choice</li>
                      <li>when we save your choice</li>
                    </ul>
                    <p>This issue does not happen if you enable JavaScript.</p>
                    <h2 className="h3">What to do if you can’t access parts of this website</h2>
                    <p>We have <a href="https://www.nhs.uk/your-nhs-data-matters/manage-your-choice/different-languages-and-formats/">information about your choice in other languages and formats</a>.</p>
                    <p>You can <a href="https://www.nhs.uk/your-nhs-data-matters/manage-your-choice/other-ways-to-manage-your-choice/">make your choice by phone or by post</a>.</p>
                    <h2 className="h3">Reporting accessibility problems with this website</h2>
                    <p>Contact us to tell us about any accessibility problems or to give us feedback.</p>
                    <p>
                      <strong>By email</strong>
                      <br/><a href="mailto:enquiries@nhsdigital.nhs.uk">enquiries@nhsdigital.nhs.uk</a>
                    </p>
                    <p>
                      <strong>By phone</strong>
                      <br/>0300 303 5678
                      <br/>Monday to Friday, 9am to 5pm excluding bank holidays
                    </p>
                    <h2 className="h3">By using the Next Generation Text service</h2>
                    <p>If you are Deaf, have hearing loss or have difficulty speaking you can contact us using the Next Generation Text (NGT) service.</p>
                    <p>To call us using the Next Generation Text service, dial 18001 followed by 0300 303 5678.</p>
                    <h2 className="h3">Enforcement procedure</h2>
                    <p>The Equality and Human Rights Commission (EHRC) is responsible for enforcing the accessibility regulations.</p>
                    <p>If you’re not happy with how we respond to your complaint, <a href="https://www.equalityadvisoryservice.com/app/ask">contact the Equality Advisory and Support Service (EASS)</a>.</p>
                    <h2 className="h3">How we tested this website</h2>
                    <p>This website was last tested on 15 May 2019.</p>
                    <p>The test was carried out by the Digital Accessibility Centre (DAC).</p>
                    <p>We tested:</p>
                    <ul>
                      <li><a href="https://www.nhs.uk/your-nhs-data-matters/">our main website</a></li>
                      <li><a href="https://your-data-matters.service.nhs.uk/">our online service</a></li>
                    </ul>
                    <h2 className="h3">Last updated</h2>
                    <p>This accessibility statement was prepared on 20 June 2019.</p>
                    <p>This accessibility statement was last updated on 20 June 2019.</p>
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
