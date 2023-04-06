import { Coin } from "../../models/coins"
import './list.scss';

type ListProps = {
    childrens: Coin[] | null,
}
export const List = ({childrens}: ListProps) => {
    return (
      <ul className="list">
        {childrens?.map((coin) => (
          <li className="list__item" key={coin.id}>
            {coin.name} {Number(coin.priceUsd).toFixed(2)}&#36;
          </li>
        ))}
      </ul>
    );
}