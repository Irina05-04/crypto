import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import './header.scss';
import { TCoin } from '../../../type/coins';


export const Header:FC = () => {
    const [topCrypto, setTopCrypto] = useState<TCoin[] | null>(null);
    const [error, setError] = useState<boolean>(false);

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
              <li className='top__item' key={coin.id}>{coin.name} {Number(coin.priceUsd).toFixed(2)}&#36;</li>
            ))}
          </ul>
          <div className="header__portfolio">5.5</div>
        </div>
      </header>
    );
}