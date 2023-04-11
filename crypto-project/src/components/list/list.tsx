import { Coin } from "../../models/coins"
import "./list.scss";

type ListProps = {
  childrens: Coin[] | null;
};
export const List = ({childrens}: ListProps) => {
  return (
    <ul className="list" data-cy="list">
      {childrens?.map((coin) => (
        <li className="list__item" data-cy="list-item" key={coin.id}>
          {coin.name} {Number(coin.priceUsd).toFixed(2)}&#36;
        </li>
      ))}
    </ul>
  );
}