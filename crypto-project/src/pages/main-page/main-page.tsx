import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { TMainPageStore } from '../../models/store';
import { Pagination } from '../../components/pagination/pagination';
import { getCoinsOnPage, getCountCoins } from '../../api/request';

import './main-page.scss';
import { Button } from '../../components/button/button';

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
  const { pageId } = useParams();
  const currentPage = Number(pageId) ?? 1;
  const indexOfLastIndex = currentPage * state.perPage;
  const indexOfFirstIndex = indexOfLastIndex - state.perPage;

  useEffect(()=>{
    (async() => {
      const response = await getCountCoins();
      setState((prev) => ({
        ...prev,
        totalCount: response.data.data.length,
      }));
    })();
  }, [])

  useEffect(() => {
    (async() => {
      const response  = await getCoinsOnPage(indexOfFirstIndex, state.perPage);
      setState((prev) => ({
        ...prev,
        coins: response.data.data,
      }));
    })();
  }, [currentPage]);

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
            {state.coins?.map((el) => (
              <tr key={el.id} className="table__row">
                <td className="table__item item item_large">
                  <NavLink
                    to={`/${currentPage}/${el.id}`}
                    className="item__link"
                  >
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
                  <Button id={el.id} onClick={openModal} variant='color' view='round' size='round-size' type='button'>
                    &#43;
                  </Button>
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
          />
        </div>
      </div>
    </main>
  );
};