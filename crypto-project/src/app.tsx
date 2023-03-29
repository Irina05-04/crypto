import axios from "axios";
import { FC, useEffect, useMemo, useState } from "react"
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Header } from "./components/header/header/header";
import { CoinPage } from "./pages/coin-page/coin-page";
import { MainPage } from "./pages/main-page/main-page";
import { ModalWindow } from './components/modal/modal';
import { AddCoin } from './components/add-coin/add-coin';
import { Portfolio } from './components/portfolio/portfolio';
import {store} from './type/store'
import {URL} from './const';
import { PortfolioContext } from "./context";


export const App:FC = () => {
    const store = localStorage.getItem('store');

    const [portfolio, setPortfolio] = useState<store[]>([]);
    const coinsPortfolio = useMemo(() => ({portfolio, setPortfolio}), [portfolio]);
    
    const [total, setTotal] = useState<number>(0);
    const totalPrice = useMemo(() => ({total, setTotal}), [total]);
    const [newTotal, setNewTotal] = useState(0);
    const [oldTotal, setOldTotal] = useState(0);
    const [error, setError] = useState(false);

    const [isActivePortfolio, setIsActivePortfolio] = useState(false);
    const [isActiveModal, setIsActiveModal] = useState(false);
    const [addCoin, setAddCoin] = useState<string | null>(null);
    // console.log(`localStorage ${localStorage.getItem('store')}`);
    // console.log(`portfolio ${portfolio}`);
    // console.log(`oldTotal ${oldTotal}`);
    // console.log(`newTotal ${newTotal}`);
    const state = {coinsPortfolio, totalPrice, oldTotal, newTotal};
    useEffect(() => {
      if (store) {
        const storeArray = JSON.parse(store);
        storeArray.map(
          (el: { name: string; amount: number; price: number }) => {
            axios
              .get(`${URL}/assets/${el.name}`)
              .then(({ data }) => {
                const obj = {
                  name: el.name,
                  amount: el.amount,
                  price: Number(data.data.priceUsd),
                };
                setPortfolio((prev) => [...prev, obj]);
                setOldTotal((prev) => (prev += el.amount * el.price));
                setNewTotal((prev) => (prev += el.amount * Number(data.data.priceUsd)));
                setTotal((prev) => (prev += el.amount * Number(data.data.priceUsd)));
              })
              .catch(() => {
                setError(true);
              });
          }
        );
      }
    }, []);
   
    return (
      <PortfolioContext.Provider value={state}>
        <Header setIsActivePortfolio={setIsActivePortfolio}/>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MainPage setIsActiveModal={setIsActiveModal} setAddCoin={setAddCoin}/>}/>
            <Route path="/:coinId" element={<CoinPage setIsActiveModal={setIsActiveModal} setAddCoin={setAddCoin}/>}/>
          </Routes>
        </HashRouter>
        <ModalWindow
          tittle='add coins'
          component={<AddCoin name={addCoin} setActive={setIsActiveModal}/>}
          isActive={isActiveModal}
          setIsActive={setIsActiveModal}
        />
        <ModalWindow
          tittle='portfolio'
          component={<Portfolio />}
          isActive={isActivePortfolio}
          setIsActive={setIsActivePortfolio}
        />
      </PortfolioContext.Provider>
    );
}