function setContactDetails(email, sms) {
  return function update(){
    return {
      sms: sms,
      email: email,
      disabled: false
    };
  };
}

export {setContactDetails};
