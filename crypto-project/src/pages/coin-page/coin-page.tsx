import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { TCoinStore } from '../../models/store';
import { ChartComponent } from '../../components/chart/chart';
import { getCoin, getHistoryCoin } from '../../api/request';

import './coin-page.scss';
import { Button } from '../../components/button/button';

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
  const navigate = useNavigate();
  const [state, setState] = useState<TCoinStore>({
    coin: null,
    historyCoin: null,
  });
  const { coinId } = useParams();
  const startDay = new Date(2023, 0, 1);
  const coinInformation = [
    { name: "shortName:", value: state.coin?.symbol },
    { name: "price:", value: Number(state.coin?.priceUsd).toFixed(4) },
    {
      name: "24h change:",
      value: Number(state.coin?.changePercent24Hr).toFixed(2),
      increase: Number(state.coin?.changePercent24Hr) > 0 ? true : false,
    },
    { name: "count active:", value: Number(state.coin?.maxSupply).toFixed(2) },
    {
      name: "24h volume:",
      value: Number(state.coin?.volumeUsd24Hr).toFixed(2),
    },
  ];

  const openModal = () => {
    setStateModal((prev) => ({
      ...prev,
      isActiveModal: true,
      addCoin: state.coin ? state.coin?.id : "",
    }));
  };
  useEffect(() => {
    if(coinId){
      Promise.all([getCoin(coinId), getHistoryCoin(coinId, startDay)]).then(
        (data) => {
          setState(() => ({
            coin: data[0].data.data,
            historyCoin: data[1].data.data,
          }));
        }
      );
    }
  }, [coinId]);

  return (
    <main className="main">
      <div className="main__container">
        <NavLink to="/" className="main__link" onClick={() => navigate(-1)}>
          &#8592;
        </NavLink>
        <h1 className="main__title">{state.coin?.name}</h1>
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
            <Button variant='color' view='round' size='round-size' onClick={openModal} type='button'>add</Button>
          </div>
          <div className="coin__chart">
            <ChartComponent
              history={state.historyCoin}
              name={state.coin?.symbol}
            />
          </div>
        </div>
      </div>
    </main>
  );
}