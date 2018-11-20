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
  var privacyNoticeComponent = getPrivacyNoticeComponent();
  var ComponentFactory = React.createFactory(privacyNoticeComponent);
  var html = ReactDOMServer.renderToString(ComponentFactory());
  LOGGER.info('rendered_html | lambda_progress=in-progress');
  return CommonUtils.DOCTYPE_TAG + html;
}

function getPrivacyNoticeComponent() {
  return PrivacyNotice;
}

class PrivacyNotice extends React.Component {
  render() {
    return (
      <html lang="en-GB">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta httpEquiv="X-Frame-Options" content="deny"/>
          <title>Privacy notice</title>
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
          <main id="mainContent" role="main">
            <div className="page-band">
              <div className="page-section">
                Find out why your NHS data matters
              </div>
            </div>
            <div className="page-section">
              <div className="reading-width">
                <h1 className="h2">How your data will be processed to register and apply your opt-out</h1>
                <div className="grid-row">
                  <div className="column--two-thirds">
                    <h2 className="h3" id="what-information-do-we-collect-about-you">National Data Opt-out Service Privacy Notice</h2>
                    <p>
                    </p>
                    <p>
                      The national data opt-out service allows you to register a national data opt-out. This prevents your confidential patient information from being used for reasons beyond your individual care and treatment. However, there are some circumstances where opt-outs do not apply. In these circumstances, your confidential patient information will still be used.
                    </p>
                    <p>
                      NHS Digital is the data controller for the data collected and processed to provide the national data opt-out service.
                    </p>
                    <p>
                      For the national data opt-out the following definitions are used:
                    </p>
                    <ul>
                      <li>
                        Confidential patient information is information which identifies you and says something about your health, care or treatment. You would expect this information to be kept private. Information that only identifies you, like your name and address, is not considered to be confidential patient information and may still be used. For example, to contact you if your GP practice is merging with another.
                      </li>
                      <li>
                        Purposes beyond your individual care and treatment include the use of your confidential patient information to plan and improve health and adult social care services in England. It also includes the use of your confidential patient information for research. This enables the NHS to develop cures for serious illnesses and plan better services for the future. You can opt-out of this, but health and care professionals may still use your confidential patient information to help with your treatment and care.
                      </li>
                      <li>
                        The national data opt-out applies to confidential patient information related to health and adult social care services in England which are publicly funded or arranged by a public body, for example a local authority.  It does not apply to health and adult social care services that you receive outside of England or if you are a private patient.
                      </li>
                    </ul>
                    <p>
                      This document sets out what personal data we collect and how we use your data to provide the national data opt-out service, including your rights and how to contact us.  It does not cover how NHS Digital processes your data to provide any other services.  This notice forms part of a range of materials. Links to further information are found below.
                    </p>
                    <ul>
                      <li>
                        <b>Patient information - </b>For information about the national data opt-out, how it works, exemptions when it does not apply and to manage your choice, please visit <a aria-label="Find out why your NHS data matters" href="https://www.nhs.uk/your-nhs-data-matters">www.nhs.uk/your-nhs-data-matters</a>.
                      </li>
                      <li>
                        <b>Policy and where opt-outs don’t apply - </b>  Health and care staff can see more information on the <a href="https://digital.nhs.uk/national-data-opt-out">national data opt-out programme</a> website. You can also find guidance on policy, information on when the national data opt-out will be applied across health and care and a full list of where an opt-out won’t apply.
                      </li>
                    </ul>
                    <h2 id="what-information-do-we-collect-about-you" className="h3">What information do we collect about you?</h2>
                    <p>
                      If you wish to set a national data opt-out or to view or change your existing choice we first need to check who you are – we match the information you provide with information we already hold on our system.  The information we need will depend on how you access the service.
                    </p>
                    <h2 id="accessing-the-service" className="h3">Accessing the service</h2>
                    <p>
                      <i>Online</i> – we ask for your name, date of birth, postcode and/or NHS number. Once we find a match and verify this, using a passcode sent to your registered mobile phone or email address, we do not keep this information.
                    </p>
                    <p>
                      <i>Assisted Online</i> - we ask for your name, date of birth, postcode and/or NHS number.  Once we find a match and verify this, using a passcode sent to your registered mobile phone or email address, we do not keep this information.
                    </p>
                    <h3 className="h4">By Post</h3>
                    <ul>
                      <li>
                        Setting an opt-out for yourself - We ask for your name, address, postcode and NHS number. If you are unable to provide an NHS number, you will need to provide copies of two identification documents (one confirming your name and the other confirming your address).
                      </li>
                      <li>
                        Setting an opt-out on behalf of another person - We ask for your name, address, postcode and proof that you can act on behalf of the other person such as a Lasting Power of Attorney. For the individual you are setting the opt-out for we ask for their name and NHS number. If you are unable to provide their NHS number, you will need to provide copies of two identification documents for this person (one confirming their name and the other confirming their address).
                        <br/>
                        <br/>
                        Once we find a match, the documents are disposed of as confidential waste. If original documents are sent in error, these will be returned to you securely.
                      </li>
                    </ul>

                    <h3 className="h4">Using NHS App</h3> – your identity is verified through the registration and login to the App itself, and only your NHS number is passed to the national data opt-out service.

                    <h2 id="what-information-do-we-store" className="h3">What information do we store?</h2>
                    <p>
                      Once we have matched you to your individual record in our secure data store, your opt-out choice is stored against your NHS number. This is the minimum information that we need to provide this service.
                    </p>
                    <p>
                      We record and store audit data each time you use the service including:
                    </p>
                    <ul>
                      <li>
                        The date and time.
                      </li>
                      <li>
                        Whether you used the online, assisted online, by post, or via the NHS App service.
                      </li>
                      <li>
                        Whether the opt-out was for yourself or for another person, for example a parent/guardian for their child.
                      </li>
                    </ul>
                    <p>
                      Your internet protocol (IP) address – a unique identifier for your computer or other access device – is also stored to help us monitor and protect the service from malicious use.
                    </p>
                    <p>
                      We also collect and retain some management information about the performance of the service itself such as time taken for each transaction or system availability.  This information does not identify you personally and is used to monitor and improve the service provided.
                    </p>
                    <p>
                      You may be invited to provide feedback on the service. You can decide if you want to participate, this does not identify you personally and is only used to improve the service provided.
                    </p>
                    <p>
                      You are under no obligation to use this service.  If you have not registered a national data opt-out, your confidential patient information will continue to be used for health research and planning. You do not need to take any action if you are content for your information to be used in this way.
                    </p>
                    <h3 className="h4">Where your data is stored</h3>
                    <p>
                      We store your data on secure cloud servers in the <a href="https://www.gov.uk/eu-eea">European Economic Area (EEA)</a>.
                    </p>
                    <h3 className="h4">How do we use your data?</h3>
                    <p>
                      NHS Digital uses your personal data to:
                    </p>
                    <ul>
                      <li>
                        Identify who you are so that your data opt-out choice is correctly allocated to your record on our secure data store
                      </li>
                      <li>
                        Make a record of your choice in our secure data store against your NHS number.
                      </li>
                      <li>
                        Uphold your data opt-out choice on data releases that we make to others.
                      </li>
                      <li>
                        Produce statistics on how many people have registered an opt-out, some analysis of their age and geographical spread and how this changes over time. This will be done in a way that does not identify you.
                      </li>
                    </ul>
                    <p>
                      NHS Digital will apply your opt-out as soon as we can after we have received it, but it may take up to 21-days for your opt-out to take effect in all releases of data.
                    </p>
                    <p>
                      NHS Digital may contact you directly about your opt-out if there are significant changes to the service or if the national data opt-out is withdrawn.
                    </p>
                    <h2 id="what-is-our-legal-basis-for-processing-this-data" className="h3">What is our legal basis for processing this data?</h2>
                    <p>
                      NHS Digital has been instructed by the Department of Health and Social Care, through a document called a Direction, to provide this service. A Direction is a legally binding document. Directions are published on the <a href="https://digital.nhs.uk/about-nhs-digital/corporate-information-and-documents/directions-and-data-provision-notices/secretary-of-state-directions/national-data-opt-out-direction-2017">NHS Digital website</a>. This means that NHS Digital is processing your personal data to meet our legal obligation to provide this service. You can choose whether you want to use this service and can change your mind at any time.
                    </p>
                    <h2 id="how-long-will-we-keep-this-information" className="h3">How long will we keep this information?</h2>
                    <p>
                      Once set, a national data opt-out is not time limited and does not change unless you take action to remove it.
                      Your opt-out continues to apply after you have died.  A national data opt-out set by a parent/guardian on behalf of a child remains in place until:
                    </p>
                    <ul>
                      <li>
                        the young person changes it once they reach the age of 13 or
                      </li>
                      <li>
                        the parent/guardian changes it – this can only be done while the child is under 13
                      </li>
                    </ul>
                    <p>
                      We will continue to uphold your data opt-out choice against your NHS number in our secure data store until instructed to stop running the service by the Department of Health and Social Care.
                    </p>
                    <p>
                      In line with our records management policy, we will retain the audit information for 8 years to enable us to monitor and report on the use of the service.
                    </p>
                    <h2 id="how-you-can-access-your-data" className="h3">How you can access your data?</h2>
                    <p>
                      You can check and change your opt-out choice at any time. This can be done through the national data opt-out service or by calling the telephone helpline on 0300 303 5678. (Open: 9am to 5pm Monday to Friday - excluding bank holidays).
                    </p>
                    <p>
                      You will need to verify your identity every time you want to access or change your data opt-out choice.
                    </p>
                    <p>
                      As we only use your NHS number to record and uphold your opt-out, you are advised to check that your choice is still correctly recorded in the event that you are assigned a different NHS number.
                    </p>
                    <h2 id="who-do-we-share-your-data-with" className="h3">Who do we share your data with?</h2>
                    <p>
                      If you decide to opt out, this will be respected and applied by NHS Digital from May 2018.  That is NHS Digital will not share your confidential patient information for research or planning purposes (subject to the list of situations where an opt-out does not apply).
                    </p>
                    <p>
                      Your decision will be respected and upheld by all other health and care organisations providing care which is publicly funded, or arranged by a public body, by March 2020.  For more details on when the national data opt-out will be applied across health and adult social care, please visit the <a href="https://digital.nhs.uk/national-data-opt-out">national data opt-out website</a>.
                    </p>
                    <p>
                      In order for other health and care organisations to respect your opt-out NHS Digital will provide access to the list of NHS numbers of those who have opted out. This data will only be used for the purposes of applying your opt-out.
                    </p>
                    <h2 className="h3">How to contact us or to make a complaint</h2>
                    <p>
                      Please contact us if you have any questions about the information provided above or about the data we hold on you in relation to this service:
                    </p>
                    <ul className="link-list">
                      <li>
                        by phone:	0300 303 5678
                      </li>
                      <li>
                        by email:	<a href="mailto:enquiries@nhsdigital.nhs.uk">enquiries@nhsdigital.nhs.uk</a>
                      </li>
                      <li>
                        by post:	National data opt-out programme, NHS Digital, 1 Trevelyan Square, Boar Lane, Leeds LS1 6AE
                      </li>
                    </ul>
                    <p>
                      If you wish to raise a complaint concerning NHS Digital’s processing of your personal data, visit our <a href="https://digital.nhs.uk/about-nhs-digital/contact-us/feedback-and-complaints">feedback and complaints</a> webpage or use the contact details above.
                    </p>
                    <p>
                      The NHS Digital Data Protection Officer can be contacted using the details below:
                    </p>
                    <ul className="link-list">
                      <li>
                        By phone:	0300 303 5678
                      </li>
                      <li>
                        By email:	<a href="mailto:nhsdigital.dpo@nhs.net">nhsdigital.dpo@nhs.net</a>
                      </li>
                      <li>
                        By post:	NHS Digital, 1 Trevelyan Square, Boar Lane, Leeds LS1 6AE
                      </li>
                    </ul>
                    <p>You have the right to raise a concern with the ICO at any time: <a href="https://ico.org.uk/global/contact-us/">Information Commissioner’s Office</a>, Wycliffe House Water Lane, Wilmslow, SK9 5AF.</p>
                    <p><a href="https://ico.org.uk/">https://ico.org.uk/</a></p>
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
