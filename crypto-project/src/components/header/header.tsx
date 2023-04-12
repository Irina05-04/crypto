import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Coin } from "../../models/coins";
import { PortfolioContext } from '../../context';
import { getTopCoins } from '../../api/request';

import './header.scss';
import { List } from '../list/list';

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
  const [topCrypto, setTopCrypto] = useState<Coin[] | null>(null);
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
        <List childrens={topCrypto} />
        <div
          className="header__portfolio"
          data-test-id="header-portfolio"
          onClick={() =>
            setStateModal((prev) => ({ ...prev, isActivePortfolio: true }))
          }
        >
          {total.toFixed(3)} USD {newTotal - oldTotal >= 0 ? " +" : " "}
          {oldTotal && (newTotal - oldTotal).toFixed(3)}(
          {oldTotal && Math.abs(100 - (newTotal * 100) / oldTotal).toFixed(2)})%
        </div>
      </div>
    </header>
  );
};
