import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom';
import { CoinPage } from './pages/coin-page/coin-page';
import { MainPage } from './pages/main-page/main-page';
import { ModalWindow } from './components/modal/modal';
import { AddCoin } from './components/add-coin/add-coin';
import { Portfolio } from './components/portfolio/portfolio';
import {TPortfolio, TStoreApp} from './type/store'
import { PortfolioContext } from './context';
import { Header } from './components/header/header';
import axios from 'axios';
import { URL } from "./const";


export const App = () => {
  const store = localStorage.getItem("store");

  const [state, setState] = useState<TStoreApp>({
    portfolio: [],
    total: 0,
    newTotal: 0,
    oldTotal: 0,
  });
  const stateInfo = useMemo(() => ({ state, setState }), [state]);

  const [stateModal, setStateModal] = useState({
    isActivePortfolio: false,
    isActiveModal: false,
    addCoin: "",
  });

  const stateContext = { stateInfo };

  useEffect(() => {
    if (store) {
    const storeArray = JSON.parse(store);
      storeArray.map(
        (el: TPortfolio) => {
          axios.get(`${URL}/assets/${el.name}`).then(({ data }) => {
            const obj = {
              name: el.name,
              amount: el.amount,
              price: Number(data.data.priceUsd),
            };
            setState((prev) => ({
              ...prev,
              portfolio: [...prev.portfolio, obj],
              oldTotal: prev.oldTotal + el.amount * el.price,
              newTotal: prev.newTotal + el.amount * Number(data.data.priceUsd),
              total: prev.total + el.amount * Number(data.data.priceUsd),
            }));
          });
        });        
      }
  }, []);

  useEffect(() => {
    localStorage.setItem("store", JSON.stringify(state.portfolio));
    localStorage.setItem("total", JSON.stringify(state.total));
  }, [state]);

  return (
    <PortfolioContext.Provider value={stateContext}>
      <Header setStateModal={setStateModal} />
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={<MainPage setStateModal={setStateModal} />}
          />
          <Route
            path="/:coinId"
            element={<CoinPage setStateModal={setStateModal} />}
          />
        </Routes>
      </HashRouter>
      {stateModal.isActiveModal && <ModalWindow
        tittle="add coins"
        component={
          <AddCoin stateModal={stateModal} setStateModal={setStateModal} />
        }
        isActive={{
          isActiveModal: stateModal.isActiveModal,
          isActivePortfolio: stateModal.isActivePortfolio,
        }}
        setIsActive={setStateModal}
      />}
      {stateModal.isActivePortfolio && <ModalWindow
        tittle="portfolio"
        component={<Portfolio />}
        isActive={stateModal}
        setIsActive={setStateModal}
      />}
    </PortfolioContext.Provider>
  );
}