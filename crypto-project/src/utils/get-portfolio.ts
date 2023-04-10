import { PortfolioCoin } from "../models/store";
import { getCoin } from "../api/request";

export function GetPortfolio(storeArray: PortfolioCoin[], newTotal: {count: number}, userCoins: PortfolioCoin[]) {
  return Promise.all(
    storeArray.map(async (el: PortfolioCoin) => {
      const response = await getCoin(el.name);
      newTotal.count += el.amount * Number(response.data.data.priceUsd);
      const obj = {
        name: el.name,
        amount: el.amount,
        price: Number(response.data.data.priceUsd),
      };
      userCoins.push(obj);
    })
  );
}