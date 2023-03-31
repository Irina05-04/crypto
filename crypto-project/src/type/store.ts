import { TCoin } from "./coins"

export type TPortfolio = {
    name: string,
    amount: number,
    price: number,
}
export type TStoreApp = {
    portfolio: TPortfolio[], 
    total: number,
    newTotal: number,
    oldTotal: number
}

export type TMainPageStore = {
  coins: TCoin[] | null,
  perPage: number,
  totalCount: number,
}