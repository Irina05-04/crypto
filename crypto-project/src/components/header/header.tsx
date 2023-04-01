import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TCoin } from '../../type/coins';
import { PortfolioContext } from '../../context';
import { getTopCoins } from '../../request';

import './header.scss';

type HeaderProps = {
  setStateModal: Dispatch<
    SetStateAction<{
      isActivePortfolio: boolean;
      isActiveModal: boolean;
      addCoin: string;
    }>
  >;
};
export const Header = ({ setStateModal }: HeaderProps) => {
  const [topCrypto, setTopCrypto] = useState<TCoin[] | null>(null);
  const {stateInfo} = useContext(PortfolioContext);

  const { total, oldTotal, newTotal } = stateInfo.state;

  useEffect(() => {
    (async () => {
      const response = await getTopCoins();
      setTopCrypto(response.data.data);
    })();
  }, []);

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
          onClick={() => setStateModal(prev => ({...prev, isActivePortfolio: true}))}
        >
          {total.toFixed(3)} USD{" "}
          {newTotal - oldTotal >= 0 ? " +" : " "}
          {oldTotal && (newTotal - oldTotal).toFixed(2)}(
          {oldTotal && Math.abs(100 - (newTotal * 100) / oldTotal).toFixed(2)})%
        </div>
      </div>
    </header>
  );
};
