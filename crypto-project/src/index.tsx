import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/base.scss';
import reportWebVitals from './reportWebVitals';
import { MainPage } from './pages/main-page/main-page';
import { Header } from './components/header/header/header';
import { CoinPage } from './pages/coin-page/coin-page';
import { HashRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Header />
    <HashRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path='/:coinId' element={<CoinPage/>}/>
        </Routes>
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();
