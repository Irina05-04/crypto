import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { CoinPage } from './pages/coin-page/coin-page';
import { MainPage } from './pages/main-page/main-page';
import { ModalWindow } from './components/modal/modal';
import { AddCoin } from './components/add-coin/add-coin';
import { Portfolio } from './components/portfolio/portfolio';
import { PortfolioCoin, StoreApp } from "./models/store";
import { PortfolioContext } from './context';
import { Header } from './components/header/header';
import { GetPortfolio } from './utils/get-portfolio';


export const App = () => {
  const store = localStorage.getItem("store");

  const [state, setState] = useState<StoreApp>({
    portfolio: [],
    total: 0,
    newTotal: 0,
    oldTotal: 0,
    currentPage: 1,
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
    const newTotal = {count: 0};
    const oldTotal = Number(localStorage.getItem('total')) ?? 0;
    const userCoins: PortfolioCoin[] = [];
    GetPortfolio(storeArray, newTotal, userCoins).then(() => {
    setState((prev) => ({
      ...prev,
      portfolio: userCoins,
      oldTotal: oldTotal,
      newTotal: newTotal.count,
      total: newTotal.count,
    }));
    })
  }}, []);

  useEffect(() => {
    localStorage.setItem("store", JSON.stringify(state.portfolio));
    localStorage.setItem("total", JSON.stringify(state.total));
  }, [state.portfolio, state.total]);

  return (
    <PortfolioContext.Provider value={stateContext}>
      <Header setStateModal={setStateModal} />
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/1" />}
          />
          <Route
            path="/:pageId"
            element={<MainPage setStateModal={setStateModal} />}
          />
          <Route
            path="/:pageId/:coinId"
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