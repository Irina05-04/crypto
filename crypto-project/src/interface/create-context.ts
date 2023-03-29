import { store } from "../type/store"

export default interface ICreateContext {
    coinsPortfolio: {
        portfolio: store[],
        setPortfolio: React.Dispatch<React.SetStateAction<store[]>>
    },
    totalPrice: {
        total: number,
        setTotal: React.Dispatch<React.SetStateAction<number>>
    },
    oldTotal: number,
    newTotal: number,
}