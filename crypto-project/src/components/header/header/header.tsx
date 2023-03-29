import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import { TCoin } from '../../../type/coins';
import { PortfolioContext } from '../../../context';
import axios from 'axios';

import './header.scss';

type HeaderProps = {
  setIsActivePortfolio : Dispatch<SetStateAction<boolean>>,
}
export const Header:FC<HeaderProps> = ({setIsActivePortfolio}) => {
    const [topCrypto, setTopCrypto] = useState<TCoin[] | null>(null);
    const [, setError] = useState<boolean>(false);
    const {totalPrice, oldTotal, newTotal} = useContext(PortfolioContext);

    useEffect(() => {
        axios.get('https://api.coincap.io/v2/assets?limit=3')
        .then(({data}) => {
            setTopCrypto(data.data);
        })
        .catch(() => {setError(true)});
    }, [])

    return (
      <header className="header">
        <div className="header__container">
          <ul className="header__top top">
            {topCrypto?.map((coin) => (
              <li className="top__item" key={coin.id}>
                {coin.name} {Number(coin.priceUsd).toFixed(2)}&#36;
              </li>
            ))}
          </ul>
          <div
            className="header__portfolio"
            onClick={() => setIsActivePortfolio(true)}
          >
            {totalPrice.total.toFixed(3)} USD{" "}
            {((newTotal - oldTotal) >= 0) ? ' +' : ' '}
            {oldTotal && (newTotal - oldTotal).toFixed(2)}
            ({oldTotal && (Math.abs(100 - (newTotal * 100) / oldTotal)).toFixed(2)})%
          </div>
        </div>
      </header>
    );
}