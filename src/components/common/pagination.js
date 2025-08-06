import React from "react";

const Pagination = props => {
  const pageLinks = [];
  let page = [];
  let current = props.currentPage;
  const getPagingRange = (
    current,
    { min = 1, total = props.pages, length = 5 } = {}
  ) => {
    if (length > total) length = total;

    let start = current - Math.floor(length / 2);
    start = Math.max(start, min);
    start = Math.min(start, min + total - length);

    Array.from({ length: length }, (el, i) => {
      page.push(start + i);
    });
  };

  getPagingRange(current);

  page.map((res, i) => {
    let activeClass =
      props.currentPage === page[i] ? "active tn-pag-color" : "";

    return pageLinks.push(
      <a
        key={i}
        className={`item ${activeClass}`}
        onClick={() => {
          props.nextPage(res);
        }}
      >
        {res}
      </a>
    );
  });

  return (
    <tfoot>
      <tr>
        <th colSpan="9">
          <div className="ui right floated pagination menu my-4 tn-page tn-b-radius-30 tn-pag-btn">
            <a className="icon item p16">Pages:{props.pages}</a>
          </div>
          <div className="ui right floated pagination menu my-4 tn-page tn-b-radius-30">
            <a
              className="icon item"
              onClick={() => {
                props.nextPage(1);
              }}
            >
              <i className="left step backward icon" />
            </a>
            {props.currentPage > 1 ? (
              <a
                className="icon item"
                onClick={() => {
                  props.nextPage(props.currentPage - 1);
                }}
              >
                <i className="left large caret left icon" />
              </a>
            ) : (
              ""
            )}
            {pageLinks}
            {props.currentPage < props.pages ? (
              <a
                className="icon item"
                onClick={() => {
                  props.nextPage(props.currentPage + 1);
                }}
              >
                <i className="right large caret right icon" />
              </a>
            ) : (
              ""
            )}
            <a
              className="icon item"
              onClick={() => {
                props.nextPage(props.pages);
              }}
            >
              <i className="right step forward icon" />
            </a>
          </div>
        </th>
      </tr>
    </tfoot>
  );
};

export default Pagination;
