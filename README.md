<img src="images/logo.png" height=72>
# NDOP (National Data Opt-out)

The National Data Opt-out Service is a service that allows patients to opt out of their confidential patient information being used for research and planning, the website project consists of multiple repositories ([ndop-back-end](https://github.com/nhsconnect/ndop-back-end), [ndop-front-end](https://github.com/nhsconnect/ndop-front-end), [ndop-nojs](https://github.com/nhsconnect/ndop-nojs))


# NDOP Front End Code

This is the source code repository for the front end portion of the National Data Opt-out Service.

## Description
This repository contains the following frontend lambda functions:

* screen lamabdas (Node Lambdas that render the HTML pages):
  * age-restriction-error
  * choice-not-saved
  * contact-details-not-recognised
  * cookies-policy
  * enter-password
  * enter-your-code
  * expired-code-error
  * generic-error
  * incorrect-code-error
  * incorrect-password-error
  * landing-page
  * lookup-failure-error
  * privacy-notice
  * quota-exceeded
  * resend-code-error
  * review-your-choice
  * service-unavailable
  * session-expired
  * set-your-preferences
  * terms-and-conditions
  * thank-you
  * verification-option
  * your-details
* JavaScript Client


## Building the code

To build the NDOP front end code locally

- clone the repository 
```
git clone https://github.com/nhsconnect/ndop-front-end.git
```

## First time setup
First time setup of the local demo is as follows:
```
cd client
npm install && npx webpack
```

- Open the `local-dev/your-details.html` for the desired screen or hard refresh the page if you're already viewing the html in you browser of choice.
