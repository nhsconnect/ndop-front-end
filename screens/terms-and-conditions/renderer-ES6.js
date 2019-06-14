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
  var termsAndConditionsComponent = getTermsAndConditionsComponent();
  var ComponentFactory = React.createFactory(termsAndConditionsComponent);
  var html = ReactDOMServer.renderToStaticMarkup(ComponentFactory());
  LOGGER.info('rendered_html | lambda_progress=in-progress');
  return CommonUtils.DOCTYPE_TAG + html;
}

function getTermsAndConditionsComponent() {
  return TermsAndConditions;
}

class TermsAndConditions extends React.Component {
  render() {
    return (
      <html lang="en-GB">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta httpEquiv="X-Frame-Options" content="deny"/>
          <title>Terms and conditions - {CONFIG.SERVICE_NAME}</title>
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
              <div className="reading-width">
                <h1 className="h2">Terms and conditions</h1>
                <div className="grid-row">
                  <div className="column--two-thirds">
                    <h2 id="terms-and-conditions" className="h3">National Data Opt-out Programme (NDOP) Terms and Conditions of Use</h2>
                    <p>March, 2018</p>
                    <p>
                      This Site (NHS.UK) and Service (National Data Opt-Out Programme), including all of its features and
                      content is made available by NHS Digital, or its affiliates (&#34;we, our or us&#34;). All content, information,
                      services and software provided on or through this Site is subject to the following terms and conditions.
                    </p>
                    <p>
                      If for any reason you are unable to use the Digital Service, there are alternative methods available for
                      setting your data sharing preference. You can request a paper-based postal form or find out more by
                      calling the NHS Digital Contact Centre on 0300 303 5678.
                    </p>
                    <p>Open: 9am to 5pm Monday to Friday (excluding bank holidays).</p>
                    <h3 className="h4">Using NHS Digital and NDOP</h3>
                    <p>You agree to use this Site and Service for lawful purposes only. You must also use it in a way that
                      doesn&#39;t inhibit the use and enjoyment of the Site by anyone else. We update this Service&#39;s content all
                      the time. We may change or remove content at any time without notice.
                    </p>
                    <h3 className="h4">Reviewing Your Preference</h3>
                    <p>
                      We withhold the right to access and use the national data opt-out list to re-contact individuals if
                      there are any significant changes made to the opt-out, or if it the policy is withdrawn. In such
                      circumstances, you may be asked to review or update your preference in agreement with the changes made.
                      For more information about how we process your personal data in order to provide this service <a id="privacyNoticeLink" href={CONFIG.PRIVACY_NOTICE_ENDPOINT}>please refer to our privacy information</a>.
                    </p>
                    <h3 className="h4">Third Party Links</h3>
                    <p>Third party content may appear on the Site or may be accessible via links from this Site. We are not
                      responsible for have no liability any third-party content on the Site. NHS Digital links to websites that
                      are managed by other health departments and agencies, Service providers or other organisations. We don&#39;t
                      have any control over the content on these websites.
                    </p>
                    <p>We&#39;re not responsible for:</p>
                    <ul>
                      <li>the protection of any information you give to these websites</li>
                      <li>any loss or damage that may come from your use of these websites, or any other websites they link to</li>
                    </ul>
                    <p>You agree to release us from any claims or disputes that may come from using these websites.</p>
                    <p>
                      You should read all terms and conditions, privacy policies and end user licences that relate to these
                      websites before you use them.
                    </p>
                    <h3 className="h4">Content</h3>
                    <p>
                      The Content on this Site is for the purpose of the service / your personal use only and not for commercial exploitation. You may not decompile, reverse engineer, disassemble, rent, lease, loan, sell, sublicense, or create derivative works from the Site, the Service or its Content. The use of any network monitoring or discovery software to determine the Site architecture, or extract information about usage, individual identities or users is prohibited. You may not use any robot, spider, other automatic software or device, or manual process to monitor or copy our Site or the Content without our prior written permission.
                    </p>
                    <p>You may not use this Site to transmit any false, misleading, fraudulent or illegal communications. You may not copy, modify, reproduce, republish, distribute, display, or transmit for commercial, non-profit or public purposes all or any portion of the Site, except to the extent permitted above. Unauthorised use of this Site or its Content is prohibited.</p>
                    <p>Content provided on the Site is not intended to and does not constitute legal advice and no solicitor-client relationship is formed through use of the Site.</p>
                    <h3 className="h4">Intellectual Property Rights</h3>
                    <p>Certain sections of this Site require you to insert personal data, this is to verify your identity and enable you to use the service in its entirety. Personal data is anything that can identify you as a natural living person, including traditional information like a name and address and extended information like IP addresses and cookies.</p>
                    <p>When requested, you agree to provide accurate and complete information that is personal/relatable to you and you only. It is your responsibility to inform an NHS service or GP practice if anything changes within that information.</p>
                    <p>We do not permit anyone other than you to use the sections requiring personal information, unless a dedicated member of the NHS Digital Contact Centre has been employed to guide you through an assisted or non-digital route through the Service.</p>
                    <h3 className="h4">Limitation of Liability</h3>
                    <p>
                      We shall not be liable for any loss, injury, claim, liability, or damage of any kind resulting from your use of this site, the content, the interactive areas, any facts or opinions appearing on or through an interactive area, or any third-party communications. We shall not be liable for any special, direct, indirect, incidental, punitive or consequential damages of any kind whatsoever (including, without limitation, solicitor fees) in any way due to, resulting from, or arising in connection with the use of or inability to use this site, the interactive areas, the content or any third-party communications.
                    </p>
                    <p>We reserve the right to investigate complaints or reported violations of our Terms and to take any action we deem appropriate including but not limited to reporting any suspected unlawful activity to law enforcement officials, regulators, or other third parties and disclosing any information necessary or appropriate to such persons or entities relating to user information, e-mail addresses, usage history, IP addresses and traffic information.</p>
                    <h3 className="h4">Children and Minors</h3>
                    <p>This Service is not available for use by children or minors under the age of 13. If you are under the age of 13 there are alternative options available to you, such as setting a preference via a parent/guardian.</p>
                    <h3 className="h4">Our Disclaimer</h3>
                    <p>While we make every effort to keep this Site and Service up to date, we don&#39;t provide any guarantees, conditions or warranties that the information will be:</p>
                    <ul>
                      <li>current</li>
                      <li>secure</li>
                      <li>accurate</li>
                      <li>complete</li>
                      <li>free from bugs or viruses</li>
                    </ul>
                    <p>We don&#39;t publish advice on this service, only information. Call the NHS telephone helpline on 0300 303 5678 for more information.</p>
                    <p>We&#39;re not liable for any loss or damage that may come from using NHS Digital. This includes:</p>
                    <ul>
                      <li>any direct, indirect or consequential losses</li>
                      <li>any loss or damage caused by civil wrongs (&#39;tort&#39;, including negligence), breach of contract or otherwise</li>
                      <li>the use of NHS Digital, NHS.UK and any websites that are linked to or from it</li>
                      <li>the inability to use NHS Digital, NHS.UK and any websites that are linked to or from it</li>
                    </ul>
                    <p>This applies if the loss or damage was foreseeable, arose in the normal course of things or you advised us that it might happen.</p>
                    <h3 className="h4">Virus Protection</h3>
                    <p>We make every effort to check and test NHS.UK for viruses at every stage of production. You must make sure that the way you use NHS.UK doesn&#39;t expose you to the risk of viruses, malicious computer code or other forms of interference which can damage your computer system.</p>
                    <p>We&#39;re not responsible for any loss, disruption or damage to your data or computer system that might happen when you use NHS.UK. When using the Site, you must not introduce viruses, trojans, worms, logic bombs or any other material that&#39;s malicious or technologically harmful.</p>
                    <p>You must not try to gain unauthorised access to NHS.UK, the server on which it&#39;s stored, or any server, computer or database connected to it. You must not attack NHS.UK in any way. This includes denial-of-Service attacks. We&#39;ll report any attacks or attempts to gain unauthorised access to NHS.UK to the relevant law enforcement authorities and share information about you with them.</p>
                    <h3 className="h4">Computer Misuse Policy</h3>
                    <p>The Computer Misuse Act is legislation that has created offences for which unauthorised access to or modification of computer data may result in criminal prosecutions. All access of computers and connected systems is governed by the Computer Misuse Act 1990. This act has created three criminal offences covering the usage of computers:</p>
                    <ol>
                      <li>Unauthorised access to computer material</li>
                      <li>Unauthorised access to a computer system with intent to commit or facilitate the commission of a further offence.</li>
                      <li>Unauthorised modification of computer material</li>
                    </ol>
                    <p>This offence includes the deliberate deletion or corruption of programmes or data. It also includes the introduction of viruses etc. where these result in the modification or destruction of data.</p>
                    <h3 className="h4">Cookies and Privacy Policy</h3>
                    <p>The <a id="cookiePolicyLink" href={CONFIG.COOKIES_POLICY_ENDPOINT}>cookie policy</a> sets out how NHS.UK and the service uses and protects any information that you provide when you use this website. NHS.UK is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this policy.</p>
                    <p>This policy also gives information about cookies - what they are, which ones are used on this website, the purposes for which they are used and how you can manage and/or disable them.</p>
                    <p>To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a id="aboutCookiesLink" target="_blank" rel="noopener noreferrer" href="www.aboutcookies.org">www.aboutcookies.org<span className="util-visuallyhidden"> - Page opens in new window</span></a><span aria-hidden="true"> (opens in new window).</span></p>
                    <h3 className="h4">Data Protection &amp; Confidentiality</h3>
                    <p>
                      Any information you give us via this Site will be processed in accordance with the Data Protection Act 1998. We will never sell, rent, or otherwise provide your personal data to any third parties (excluding those trusted organisations that carry out functions or services on our behalf) unless you give us permission to do so, or we are obliged or permitted by law to disclose it or where it is necessary for the purpose of or in connection with legal proceedings or in order to exercise or defend legal rights.
                    </p>
                    <p>All email messages sent to and from NHS.UK may be monitored to ensure compliance with internal policies and to protect our business.</p>
                    <h3 className="h4">This Agreement</h3>
                    <p>This Agreement, and any non-contractual obligations arising out of or in connection with this Agreement, shall be governed by and construed in accordance English law. The parties irrevocably agree that the courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claims which may arise under or in connection with this Agreement (including non-contractual disputes or claims).</p>
                    <h3 className="h4">Modifications</h3>
                    <p>We reserve the right to change these Terms at any time. Updated versions of the Terms will appear on this Site and are effective immediately. You are responsible for regularly reviewing the Terms. Continued use of this Site after any such changes constitutes your consent to such changes.</p>
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
