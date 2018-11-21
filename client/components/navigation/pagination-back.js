import React from 'react';
import PropTypes from 'prop-types';

const PaginationBack = (props) => {
  return <div className="page-section">
    <div className="reading-width">
      <div className="grid-row">
        <div className="column--three-quarters">
          <nav role="navigation" aria-label="Guide pagination">
            <ul className="article-pagination">
              <li className="article-pagination__item article-pagination__item--left">
                <a id={props.id} title={props.title} href={props.link} rel="prev">
                  <span className="article-pagination__prefix">&larr; Previous</span>
                  <span className="article-pagination__title">Before you start</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>;
};

PaginationBack.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  link: PropTypes.string,
};

export {PaginationBack};
