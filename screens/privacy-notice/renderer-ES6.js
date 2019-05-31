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
  var html = ReactDOMServer.renderToStaticMarkup(ComponentFactory());
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
          <title>National Data Opt-out &#34;{CONFIG.SERVICE_NAME}&#34; Service Privacy Notice</title>
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
                <div className="column--full">
                  <h1 className="page-title">Privacy notice</h1>
                </div>
                <div className="column--one-third-right">
                  <h2 className="h3">Page contents</h2>
                  <ol className="link-list">
                    <li>
                      <a href="#Where-you-have-a-choice">Where you have a choice</a>
                    </li>
                    <li>
                      <a href="#Where-your-choice-does-not-apply">Where your choice does not apply</a>
                    </li>
                    <li>
                      <a href="#When-your-choice-will-be-applied">When your choice will be applied</a>
                    </li>
                    <li>
                      <a href="#How-your-data-is-processed-to-register-and-apply-your-choice">How your data is processed to register and apply your choice</a>
                    </li>
                    <li>
                      <a href="#Accessing-the-service">Accessing the service</a>
                    </li>
                    <li>
                      <a href="#Information-we-store">Information we store</a>
                    </li>
                    <li>
                      <a href="#Where-your-data-is-stored">Where your data is stored</a>
                    </li>
                    <li>
                      <a href="#How-to-view-and-change-your-choice">How to view and change your choice</a>
                    </li>
                    <li>
                      <a href="#Who-we-share-your-data-with">Who we share your data with</a>
                    </li>
                    <li>
                      <a href="#Further-information">How to get further Information</a>
                    </li>
                    <li>
                      <a href="#How-to-contact-us">How to contact us</a>
                    </li>
                    <li>
                      <a href="#Make-a-complaint">Make a complaint</a>
                    </li>
                  </ol>
                </div>

                <div className="column--two-thirds">
                  <div className="reading-width">

                    <p>The &#39;{CONFIG.SERVICE_NAME}&#39; service allows you to choose whether or not your confidential patient information can be used for research and planning purposes. This prevents your confidential patient information from being used for purposes beyond your individual care and treatment.</p>

                    <p>This document explains the choice you have, what it will mean for you and where your choice does not apply. It tells you what information NHS Digital collects and how it is used to provide this service, including your rights and how to contact us. This document forms part of a range of materials and information to help you make an informed choice about how your confidential patient information is used.</p>

                    <h2 id="Where-you-have-a-choice">Where you have a choice</h2>
                    <p>You have a choice on whether or not your confidential patient information can be used for purposes beyond your individual care and treatment. If you would like this to stop, you can opt out of this yourself or on behalf of someone else. If you want to allow your confidential patient information to continue to be used for research and planning and you have not previously opted out of this, you do not need to take any action. The choice you make applies to publicly funded care in England only.</p>

                    <h3>Confidential patient information</h3>
                    <p>This is information which identifies you and says something about your health, care or treatment. You would expect this information to be kept private. Information that only identifies you, like your name and address, is not considered to be confidential patient information and may still be used. For example, to contact you if your GP practice is merging with another. Information about your health or care that is anonymised so that you can no longer be identified is not considered to be confidential patient information.</p>

                    <h3>Purposes beyond your individual care and treatment</h3>
                    <p>This includes the use of your confidential patient information to plan and improve health and adult social care services. For example, deciding where to locate a new clinic or information used to compare the quality of care provided across the country. It also includes the use of your confidential patient information for research. For example, to develop new treatments for serious illnesses. The choice you make does not apply when your information is used to help with your own treatment and care.</p>

                    <h3>Publicly funded care in England</h3>
                    <p>The choice you make applies to confidential patient information related to health and adult social care services in England, which are publicly funded or have been arranged by a public body. For example, a local authority. It does not apply to health and adult social care services that you receive outside of England or if you are a private patient.</p>


                    <h2 id="Where-your-choice-does-not-apply">Where your choice does not apply</h2>
                    <p>There are some situations where your choice does not apply and your confidential patient information may still be used.</p>

                    <h3>When required by law</h3>
                    <p>Your confidential patient information may still be used when there is a legal requirement to provide it, such as a court order.</p>

                    <h3>When you have given consent</h3>
                    <p>Your confidential patient information may still be used when you have given your consent. Such as, for a medical research study.</p>

                    <h3>Where there is overriding public interest</h3>
                    <p>Your confidential patient information may still be used in an emergency or in situations where there is an overriding benefit to others. For example, to help manage contagious diseases and stop them spreading, like meningitis. In these situations, the safety of others is most important.</p>

                    <h3>When information that can identify you is removed</h3>
                    <p>Information about your health care or treatment may still be used in research and planning if the information that can identify you is removed first.</p>

                    <h3 className="specific-exclusions">Where there is a specific exclusion</h3>
                    <p>Your choice does not apply to a small number of specific exclusions, including:</p>
                    <ul>
                      <li>when information is given to the Office for National Statistics for official statistics, like the Population Census</li>
                      <li>to the National Cancer Patient Experience Survey (CPES) and CQC NHS Patient Survey Programme</li>
                      <li>to data shared with Public Health England for the National Cancer Registration Service, the National Congenital Anomalies and Rare Diseases Registration Service and the oversight of population screening programmes</li>
                      <li>where data is used to make sure people with learning disabilities and/or autism receive the best care possible when in hospital for mental health or challenging behaviour issues (also known as assuring transformation)</li>
                      <li>where data is used to make sure correct payment is made when there is no contract. For example, if a patient lives in Bromley but is treated in hospital in Devon, an invoice will be sent from Devon to the Clinical Commissioning Group (CCG) in Bromley that holds the budget for the patient</li>
                      <li>when the confidential patient information does not contain your NHS number and if obtaining the number would involve disproportionate effort. This exclusion is likely to apply in limited circumstances as health organisations are legally obliged to use the NHS number.  It may apply to historic data or to some adult social care services e.g. home care.</li>
                    </ul>
                    <p>You may be able to make a separate decision on whether or not your information can be used by some of the other services listed.</p>
                    <ul className="link-list">
                      <li>
                        <a href="https://www.ndrs.nhs.uk/">Make a separate choice for the National Cancer Registration Service</a>
                      </li>
                      <li>
                        <a href="https://www.gov.uk/guidance/the-national-congenital-anomaly-and-rare-disease-registration-service-ncardrs">Make a separate choice for the National Congenital Anomalies and Rare Diseases Registration Service</a>
                      </li>
                      <li>
                        <a href="https://www.gov.uk/government/publications/opting-out-of-the-nhs-population-screening-programmes/opting-out-of-screening">Make a separate choice for population screening programmes</a>
                      </li>
                      <li>
                        <a href="https://www.england.nhs.uk/learning-disabilities/care/atd/">Make a separate choice for assuring transformation data</a>
                      </li>
                    </ul>

                    <h2 id="When-your-choice-will-be-applied">When your choice will be applied</h2>
                    <p>The choice you make will be respected and applied by NHS Digital and Public Health England first, before being rolled out gradually across all other national organisations. All other health and care organisations are required to comply by March 2020. For more detail on the timetable for your choice to take effect across health and adult social care, please visit the <a href="https://digital.nhs.uk/services/national-data-opt-out-programme">national data opt-out programme website</a>. Local health and care organisations are required to inform their patients once they have taken steps to comply with the national data opt-out policy. You may wish to check any privacy information provided locally.</p>
                    <p>From registering your decision, it can take up to 21 days before your choice is applied to data being used across all health and care organisations.</p>

                    <h2 id="How-your-data-is-processed-to-register-and-apply-your-choice">How your data is processed to register and apply your choice</h2>
                    <p>NHS Digital is the data controller for the data collected and processed to provide the &#39;{CONFIG.SERVICE_NAME}&#39; service. This section explains how we process your data, your rights and how to raise concerns if you are not happy.</p>

                    <h3>Information we collect from you</h3>
                    <p>If you wish to make a choice, or to view or change your existing choice, we first need to check who you are. We match the information you provide (for example name, date of birth, postcode and NHS number) with information we already hold on our system. The information we need will depend on how you access the service.</p>
                    <p>You can manage your choice by:</p>
                    <ul>
                      <li>using the online service</li>
                      <li>using the assisted online service</li>
                      <li>post</li>
                      <li>using the NHS App</li>
                    </ul>

                    <h2 id="Accessing-the-service">Accessing the service</h2>
                    <h3>Online & Assisted Online</h3>
                    <p>We ask for your name, date of birth, postcode and/or NHS number. Once we find a match and verify this, using a passcode sent to your registered mobile phone or email address, we do not keep this information.</p>

                    <h3>NHS App</h3>
                    <p>Your identity is verified through the registration and login to the App itself. Only your NHS number is passed to the &#39;{CONFIG.SERVICE_NAME}&#39; service.</p>

                    <h3>By post – making a choice for yourself</h3>
                    <p>We ask for your name, address, postcode and NHS number. If you are unable to provide an NHS number, you will need to provide copies of two identification documents (one confirming your name and the other confirming your address).</p>

                    <h3>By post – making a choice on behalf of another adult</h3>
                    <p>We ask for your name, address, postcode and proof that you can act on behalf of the other person, like a Lasting Power of Attorney. For the individual you are making a choice for, we ask for their name and NHS number. If you are unable to provide their NHS number, you will need to provide copies of two identification documents for this person (one confirming their name and the other confirming their address). Once we have completed the verification checks these documents are retained for 3 months before being disposed of as confidential waste. If original documents are sent in error, these will be returned to you securely.</p>

                    <h3>By post – making a choice on behalf of a child</h3>
                    <p>We ask for your name, address, postcode and for you to sign a declaration that you have parental responsibility for the children named on the form. For the children you are making a choice for, we ask for their name and NHS number. If you are unable to provide their NHS number, you will need to provide a copy of their passport or birth certificate. Once we have completed the verification checks these documents are retained for 3 months before being disposed of as confidential waste. If original documents are sent in error, these will be returned to you securely.</p>

                    <h2 id="Information-we-store">Information we store</h2>
                    <p>Once we have matched you to your individual record in our secure data store, your choice is stored against your NHS number. This is the minimum amount of information that we need to provide this service. </p>
                    <p>We record and store audit data each time you use the service, including:</p>
                    <ul>
                      <li>the date and time</li>
                      <li>whether you used the online, assisted online, postal or NHS App service</li>
                      <li>whether the choice you made was for yourself or for another person</li>
                    </ul>
                    <p>Your internet protocol (IP) address is also stored to help us monitor and protect the service from malicious use. An IP address is a unique identifier for your computer or other access device. We also collect and retain some management information about the performance of the service itself, such as the time taken for each transaction or system availability. This information does not identify you personally and is used to monitor and improve the service provided.</p>
                    <p>You may be invited to provide feedback on the service. You can decide if you want to participate, this does not identify you personally and is only used to improve the service provided.</p>

                    <h2 id="Where-your-data-is-stored">Where your data is stored</h2>
                    <p>We store your data on secure cloud servers in the <a href="https://www.gov.uk/eu-eea">European Economic Area (EEA)</a>.</p>

                    <h2 className="How-we-use-your-data">How we use your data</h2>
                    <p>NHS Digital uses your personal data to:</p>
                    <ul>
                      <li>identify who you are so that your choice is correctly allocated to your record on our secure data store</li>
                      <li>make a record of your choice against your NHS number in our secure data store apply your choice on data releases that we make to others</li>
                      <li>provide a service to enable other organisations to apply your choice</li>
                      <li>produce statistics on how many people have chosen to stop sharing their information, some analysis of their age and geographical spread and how this changes over time. This will be done in a way that does not identify you</li>
                      <li>NHS Digital may contact you directly about the choice you make if there are significant changes to the service or if it is withdrawn.</li>
                    </ul>

                    <h3>Our legal basis for processing this data</h3>
                    <p>NHS Digital has been instructed by the Department of Health and Social Care, through a document called a Direction, to provide this service. A Direction is a legally binding document. <a href="https://digital.nhs.uk/about-nhs-digital/corporate-information-and-documents/directions-and-data-provision-notices/secretary-of-state-directions/national-data-opt-out-direction-2017">Directions are published on the NHS Digital website</a>. This means that NHS Digital is processing your personal data to meet our legal obligation to provide this service. You can choose whether you want to use this service and can change your mind at any time.</p>

                    <h3>How long we keep this information for?</h3>
                    <p>Once you make a choice, the decision you make is not time limited and does not change unless you take action to change it. Your choice continues to apply after you have died. We will continue to uphold the choice you make against your NHS number in our secure data store until instructed to stop running the service by the Department of Health and Social Care.</p>
                    <p>A choice made by a parent/guardian on behalf of a child remains in place until:</p>
                    <ul>
                      <li>the young person changes it once they reach the age of 13</li>
                      <li>the parent/guardian changes it (only if the child is under 13)</li>
                    </ul>
                    <p>In line with our records management policy, we retain the audit information for a minimum of 8 years to enable us to monitor and report on the use of the service. We retain the “by post” documentation for 3 months. </p>

                    <h2 id="How-to-view-and-change-your-choice">How to view and change your choice</h2>
                    <p>You can check and change the choice you make at any time. This can be done through the &#39;{CONFIG.SERVICE_NAME}&#39; service or by calling the telephone helpline on 0300 303 5678. (Open: 9am to 5pm Monday to Friday - excluding bank holidays).</p>
                    <p>You will need to confirm who you are every time you want to access or change your decision. As we only use your NHS number to record and uphold your choice, you are advised to check that your choice is still correctly recorded in the event that you are assigned a different NHS number.</p>

                    <h2 id="Who-we-share-your-data-with">Who we share your data with</h2>
                    <p>In order for other health and care organisations to respect your choice, NHS Digital will provide access to the list of NHS numbers of those who have chosen not to allow their data to be used beyond their individual care and treatment. This data will only be used for the purposes of applying the choice you make.</p>

                    <h2 id="Further-information">Further information</h2>
                    <h3>Patient information</h3>
                    <p>If you wish to make a choice, or to view or change your existing choice, visit the <a href="https://your-data-matters.service.nhs.uk/">&#39;{CONFIG.SERVICE_NAME}&#39; website</a>. Alternatively, you can call us on 0300 303 5678.</p>

                    <h3>Health and care staff information</h3>
                    <p>Health and care staff can find more information on the <a href="https://digital.nhs.uk/services/national-data-opt-out-programme">national data opt-out programme website</a>. This includes detailed guidance on policy, information on when this service will be applied across health and care and a range of factsheets and resources for staff and patients.</p>

                    <h3>Data collection and processing</h3>
                    <p>More information about NHS Digital&#39;s role to collect, process and protect health and care information and <a href="https://digital.nhs.uk/about-nhs-digital/our-work/keeping-patient-data-safe/how-we-look-after-your-health-and-care-information/nhs-digital-s-legal-right-to-collect-information">how we meet our legal obligations can be found on the NHS Digital website</a>.</p>

                    <h2 id="How-to-contact-us">How to contact us</h2>
                    <p>Please contact us if you have any questions about the information provided above or about the data we hold on you in relation to this service:</p>
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

                    <h2 id="Make-a-complaint">Make a complaint</h2>
                    <p>If you wish to raise a complaint concerning NHS Digital&#39;s processing of your personal data, visit <a href="https://digital.nhs.uk/about-nhs-digital/contact-us/feedback-and-complaints">our feedback and complaints webpage</a> or contact us.</p>
                    <p>The NHS Digital Data Protection Officer can be contacted by telephone, email or post.</p>
                    <ul className="link-list">
                      <li>
                        by phone:	0300 303 5678
                      </li>
                      <li>
                        by email:	<a href="mailto:nhsdigital.dpo@nhs.net">nhsdigital.dpo@nhs.net</a>
                      </li>
                      <li>
                        by post:	NHS Digital, 1 Trevelyan Square, Boar Lane, Leeds LS1 6AE
                      </li>
                    </ul>
                    <p>You have the right to raise a concern with the ICO at any time: <a href="https://ico.org.uk/global/contact-us/">Information Commissioner&#39;s Office</a>,  Wycliffe House Water Lane, Wilmslow, SK9 5AF.</p>
                    <p><a href="https://ico.org.uk/">https://ico.org.uk/</a></p>

                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer role="contentinfo">
            <div className="global-footer">
              <div className="global-footer__inner">
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
