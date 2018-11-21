import React from 'react';


export const SuccessAlert = (props) => {
  return <div
    className="alert alert-success"
    id="flash-message"
    role="alert">
    <p>
      {props.children}
    </p>
  </div>;
};
