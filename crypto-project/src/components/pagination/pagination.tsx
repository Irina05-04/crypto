import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import './pagination.scss';
import { Button } from '../button/button';

type PaginationProps = {
  coinsCount: number;
  perPage: number;
  currentPage: number;
};
export const Pagination = ({ coinsCount, perPage, currentPage }: PaginationProps) => {
  const [state, setState] = useState({
    pageNumberLimit: 5,
    maxPageNumberLimit: 5,
    minPageNumberLimit: 1,
  });
  const changeView = (currentPage: number) => {
    if(currentPage > state.maxPageNumberLimit){
      setState((prev) => ({
        ...prev,
        maxPageNumberLimit: state.maxPageNumberLimit + state.pageNumberLimit,
        minPageNumberLimit: state.minPageNumberLimit + state.pageNumberLimit,
      }));
    }
  }
  useEffect(() => {
    changeView(currentPage);
  }, []);
  const navigate = useNavigate();

  const pages = [];
  for (let i = 1; i <= Math.ceil(coinsCount / perPage); i++) {
    pages.push(i);
  }

  const handleNext = () => {
    navigate(`/${currentPage + 1}`);
    changeView(currentPage + 1);
  };
  const handlePrev = () => {
    navigate(`/${currentPage - 1}`);
    if ((currentPage - 1) % state.pageNumberLimit === 0) {
      setState((prev) => ({
        ...prev,
        maxPageNumberLimit: state.maxPageNumberLimit - state.pageNumberLimit,
        minPageNumberLimit: state.minPageNumberLimit - state.pageNumberLimit,
      }));
    }
  };

  const renderPageNumbers = pages.map(
    (el) =>
      el < state.maxPageNumberLimit + 1 &&
      el >= state.minPageNumberLimit && (
        <NavLink
          to={`/${el}`}
          className={
            currentPage === el
              ? "pagination__item pagination__item_active"
              : "pagination__item"
          }
          key={el}
        >
          {el}
        </NavLink>
      )
  );

  return (
    <ul className="pagination">
      <li className="pagination__control control" data-dest-id="prev">
        <Button
          type="button"
          size='medium'
          view='square'
          variant="color"
          onClick={handlePrev}
          disabled={currentPage === pages[0] && true}
        >
          prev
        </Button>
      </li>
      {state.minPageNumberLimit !== 1 && (
        <li className="pagination__dots"> &hellip; </li>
      )}
      {renderPageNumbers}
      {pages.length > state.maxPageNumberLimit && (
        <li className="pagination__dots"> &hellip; </li>
      )}
      <li className="pagination__control control" data-dest-id="next">
        <Button
          type="button"
          view='square'
          variant="color"
          size='medium'
          onClick={handleNext}
          disabled={currentPage === pages[pages.length - 1] && true}
        >
          next
        </Button>
      </li>
    </ul>
  );
};
