import { getAttributeFromDOM } from './utils.js';

const OTP_LENGTH = parseInt(getAttributeFromDOM('data-otp-length'));
const INFO_ICON_IMAGE = getAttributeFromDOM('data-info-icon-image-ref');
const FHIR_STUB_ENABLED = getAttributeFromDOM('data-fhir-stub-enabled');

export {
  OTP_LENGTH,
  INFO_ICON_IMAGE,
  FHIR_STUB_ENABLED
};
