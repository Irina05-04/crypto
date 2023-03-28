import axios from "axios";
import {URL} from '../../const';

import { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { TCoin, THistory } from "../../type/coins";

import './coin-page.scss';
import { ChartComponent } from "../../components/chart/chart";
import { NavLink } from "react-router-dom";

export const CoinPage:FC = () => {
    const [error, setError] = useState(false);
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

    useEffect(() => {
        axios.get(`${URL}/assets/${coinId}`)
        .then(({data}) => {
            setCoin(data.data);
        })
        .catch(() => {setError(true)});
        axios.get(`${URL}/assets/${coinId}/history?interval=d1&start=${Number(startDay)}&end=${Date.now()}`)
        .then(({data}) => {
            setHistoryCoin(data.data);
        })
        .catch(() => {setError(true)});
    }, [coinId])

    return (
      <main className="main">
        <div className="main__container">
          <NavLink to='/' className='main__link'>&#8592;</NavLink>
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
                        {el.increase ? (<span className="arrow">&#8593;</span>) : (<span className="arrow">&#8595;</span>)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <button className="coin__button">add</button>
            </div>
            <div className="coin__chart">
              <ChartComponent history={historyCoin} name={coin?.symbol} />
            </div>
          </div>
        </div>
      </main>
    );
}