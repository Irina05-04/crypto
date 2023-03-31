import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { TMainPageStore } from '../../type/store';
import { Pagination } from '../../components/pagination/pagination';
import {URL} from '../../const';
import axios from 'axios';

import './main-page.scss';


type MainPageProps = {
  setStateModal: Dispatch<
    SetStateAction<{
      isActivePortfolio: boolean;
      isActiveModal: boolean;
      addCoin: string;
    }>
  >;
};

export const MainPage = ({ setStateModal }: MainPageProps) => {
  const [state, setState] = useState<TMainPageStore>({
    coins: null,
    perPage: 10,
    totalCount: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastIndex = currentPage * state.perPage;
  const indexOfFirstIndex = indexOfLastIndex - state.perPage;
  const currentItems = state.coins?.slice(indexOfFirstIndex, indexOfLastIndex);

  useEffect(() => {
    axios.get(`${URL}/assets`).then(({ data }) => {
      setState((prev) => ({
        ...prev,
        coins: data.data,
        totalCount: data.data.length,
      }));
    });
  }, []);

  const openModal = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    setStateModal((prev) => ({
      ...prev,
      addCoin: target.id,
      isActiveModal: true,
    }));
  };

  return (
    <main className="main">
      <div className="main__container">
        <table className="main__table table">
          <tbody className="table__body">
            <tr className="table__row">
              <th className="table__name">name</th>
              <th className="table__name">price</th>
              <th className="table__name">change</th>
              <th className="table__name"> </th>
            </tr>
            {currentItems?.map((el) => (
              <tr key={el.id} className="table__row">
                <td className="table__item item item_large">
                  <NavLink to={`/${el.id}`} className="item__link">
                    {el.symbol} ({el.name})
                  </NavLink>
                </td>
                <td className="table__item item">
                  {Number(el.priceUsd).toFixed(3)}&#36;
                </td>
                <td
                  className={
                    Number(el.changePercent24Hr) > 0
                      ? "table__item item item_increase"
                      : "table__item item item_decrese"
                  }
                >
                  {Number(el.changePercent24Hr).toFixed(3)}
                  {Number(el.changePercent24Hr) > 0 ? (
                    <span className="item__arrow">&#8593;</span>
                  ) : (
                    <span className="item__arrow">&#8595;</span>
                  )}
                </td>
                <td className="table__item_button item">
                  <button
                    className="item__button button"
                    id={el.id}
                    onClick={openModal}
                  >
                    &#43;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="main__pagination">
          <Pagination
            coinsCount={state.totalCount}
            perPage={state.perPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
};