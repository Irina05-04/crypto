import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom';
import { TCoin, THistory } from '../../type/coins';
import { ChartComponent } from '../../components/chart/chart';
import axios from 'axios';
import { URL } from "../../const";

import './coin-page.scss';

type CoinPageProps = {
  setStateModal: Dispatch<
    SetStateAction<{
      isActivePortfolio: boolean;
      isActiveModal: boolean;
      addCoin: string;
    }>
  >;
};

export const CoinPage = ({setStateModal}: CoinPageProps) => {
    const [coin, setCoin] = useState<TCoin | null>(null);
    const [historyCoin, setHistoryCoin] = useState<THistory[] | null>(null);
    const {coinId} = useParams();
    const startDay = new Date(2023, 0, 1);

    const coinInformation = [
      { name: "shortName:", value: coin?.symbol },
      { name: "price:", value: Number(coin?.priceUsd).toFixed(4) },
      {
        name: "24h change:",
        value: Number(coin?.changePercent24Hr).toFixed(2),
        increase: Number(coin?.changePercent24Hr) > 0 ? true : false,
      },
      { name: "count active:", value: Number(coin?.maxSupply).toFixed(2) },
      { name: "24h volume:", value: Number(coin?.volumeUsd24Hr).toFixed(2) },
    ];

    const openModal = () => {
      setStateModal((prev) => ({
        ...prev,
        isActiveModal: true,
        addCoin: coin ? coin?.id : '',
      }));
    }

    useEffect(() => {
        axios.get(`${URL}/assets/${coinId}`)
        .then(({data}) => {
            setCoin(data.data);
        })
        axios.get(`${URL}/assets/${coinId}/history?interval=d1&start=${Number(startDay)}&end=${Date.now()}`)
        .then(({data}) => {
            setHistoryCoin(data.data);
        })
    }, [coinId])

    return (
      <main className="main">
        <div className="main__container">
          <NavLink to="/" className="main__link">
            &#8592;
          </NavLink>
          <h1 className="main__title">{coin?.name}</h1>
          <div className="coin">
            <div className="coin__about">
              <ul className="coin__information information">
                {coinInformation.map((el) => (
                  <li className="information__item" key={el.name}>
                    <span className="information__name">{el.name}</span>
                    {el.name !== "24h change:" && `${el.value}`}
                    {el.name === "24h change:" && (
                      <span className={el.increase ? "_increase" : "_decrease"}>
                        {el.value}
                        {el.increase ? (
                          <span className="arrow">&#8593;</span>
                        ) : (
                          <span className="arrow">&#8595;</span>
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <button className="coin__button" onClick={openModal}>
                add
              </button>
            </div>
            <div className="coin__chart">
              <ChartComponent history={historyCoin} name={coin?.symbol} />
            </div>
          </div>
        </div>
      </main>
    );
}