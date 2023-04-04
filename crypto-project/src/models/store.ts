import { Coin, History } from "./coins"

export type PortfolioCoin = {
  name: string,
  amount: number,
  price: number,
}
export type StoreApp = {
  portfolio: PortfolioCoin[];
  total: number;
  newTotal: number;
  oldTotal: number;
  currentPage: number;
};

export type TMainPageStore = {
  coins: Coin[] | null,
  perPage: number,
  totalCount: number,
}
export type TCoinStore = {
  coin: Coin | null;
  historyCoin: History[] | null;
};