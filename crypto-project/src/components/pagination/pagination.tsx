import { Dispatch, SetStateAction, useState } from 'react';

import './pagination.scss';

type PaginationProps = {
  coinsCount: number;
  perPage: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};
export const Pagination = ({
  coinsCount,
  perPage,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const [state, setState] = useState({
    pageNumberLimit: 5,
    maxPageNumberLimit: 5,
    minPageNumberLimit: 1,
  });

  const pages = [];
  for (let i = 1; i <= Math.ceil(coinsCount / perPage); i++) {
    pages.push(i);
  }

  const handelClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    setCurrentPage(Number(target.textContent));
  };
  const handleNext = () => {
    setCurrentPage((prev) => (prev += 1));
    if (currentPage + 1 > state.maxPageNumberLimit) {
      setState((prev) => ({
        ...prev,
        maxPageNumberLimit: state.maxPageNumberLimit + state.pageNumberLimit,
        minPageNumberLimit: state.minPageNumberLimit + state.pageNumberLimit
      }));
    }
  };
  const handlePrev = () => {
    setCurrentPage((prev) => (prev -= 1));
    if ((currentPage - 1) % state.pageNumberLimit === 0) {
        setState((prev) => ({
            ...prev,
            maxPageNumberLimit: state.maxPageNumberLimit - state.pageNumberLimit,
            minPageNumberLimit: state.minPageNumberLimit - state.pageNumberLimit
          }));
    }
  };

  const renderPageNumbers = pages.map(
    (el) =>
      el < state.maxPageNumberLimit + 1 &&
      el >= state.minPageNumberLimit && (
        <li
          className={
            currentPage === el
              ? "pagination__item pagination__item_active"
              : "pagination__item"
          }
          key={el}
          onClick={handelClick}
        >
          {el}
        </li>
      )
  );

  return (
    <ul className="pagination">
      <li className="pagination__control control">
        <button
          className="control__button"
          onClick={handlePrev}
          disabled={currentPage === pages[0] && true}
        >
          prev
        </button>
      </li>
      {state.minPageNumberLimit !== 1 && (
        <li className="pagination__dots"> &hellip; </li>
      )}
      {renderPageNumbers}
      {pages.length > state.maxPageNumberLimit && (
        <li className="pagination__dots"> &hellip; </li>
      )}
      <li className="pagination__control control">
        <button
          className="control__button"
          onClick={handleNext}
          disabled={currentPage === pages[pages.length - 1] && true}
        >
          next
        </button>
      </li>
    </ul>
  );
};
