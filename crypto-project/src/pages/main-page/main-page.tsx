import { FC, useEffect, useState } from 'react';
import {URL} from '../../const';

import './main-page.scss';
import { TCoin } from '../../type/coins';
import { Pagination } from '../../components/header/pagination/pagination';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { ModalWindow } from '../../components/modal/modal';
import { AddCoin } from '../../components/add-coin/add-coin';

export const MainPage:FC = () => {
    const [error, setError] = useState(false);
    const [coins, setCoins] = useState<TCoin[] | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, ] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const indexOfLastIndex = currentPage * perPage;
    const indexOfFirstIndex = indexOfLastIndex - perPage;
    const currentItems = coins?.slice(indexOfFirstIndex, indexOfLastIndex);
    const [isActiveModal, setIsActiveModal] = useState(false);
    const [addCoin, setAddCoin] = useState<string | null>(null);

    useEffect(() => {
        axios.get(`${URL}/assets`)
        .then(({data}) => {
            setCoins(data.data);
            setTotalCount(data.data.length);

        })
        .catch(() => {setError(true)});
    }, [])
    
    const openModal = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      setAddCoin(target.id);
      const id = target.id;
      setIsActiveModal(true);
    }

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
                      {el.symbol}({el.name})
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
                    <button className="item__button button" id={el.id} onClick={openModal}>
                      &#43;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="main__pagination">
            <Pagination
              coinsCount={totalCount}
              perPage={perPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
        <ModalWindow
          tittle='add coins'
          component={<AddCoin name={addCoin}/>}
          isActive={isActiveModal}
          setIsActive={setIsActiveModal}
        />
      </main>
    );
}