import { FC, useContext } from "react";
import { PortfolioContext } from "../../context";

import './portfolio.scss';

export const Portfolio:FC = () => {
    const {coinsPortfolio, totalPrice} = useContext(PortfolioContext);
    const {total, setTotal} = totalPrice;
    const {portfolio, setPortfolio} = coinsPortfolio;
    const deleteCoin = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        const search = portfolio.find(el => el.name === target.id);
        const buff = portfolio.filter(el => el.name !== target.id);
        setPortfolio(buff);
        setTotal(prev => prev -= Number(search?.price) * Number(search?.amount));
        localStorage.setItem("total", (total - Number(search?.price) * Number(search?.amount)).toString());
    }

    return (
      <div className="portfolio">
        {portfolio.length !== 0 && 
        <table className="portfolio__table">
          <tbody className="portfolio__body">
            {portfolio.map((el) => (
              <tr className="portfolio__row row" key={el.name}>
                <td className="row__item">{el.name}</td>
                <td className="row__item">{el.amount}</td>
                <td className="row__item">
                  <button className="row__button" id={el.name} onClick={deleteCoin}>delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
        {portfolio.length === 0 && <p className="portfolio__info">empty</p>}
      </div>
    );
}