import React from 'react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';

export const DescriptionList = (props) => {
  return <dl className="review-your-answers" id={props.id}>
    <div>
      <dt className="question">
        {props.question}
      </dt>
      <dd className="answer" id={props.id + '-answer'}>
        {props.answer}
      </dd>
      <dd className="change">
        <Link to={props.route} id={props.id + '-change'}>Change<span className="util-visuallyhidden"> {props.question}</span></Link>
      </dd>
    </div>
  </dl>;
};

DescriptionList.propTypes = {
  id: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired
};
