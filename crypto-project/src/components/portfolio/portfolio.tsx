import { useContext } from 'react';
import { PortfolioContext } from '../../context';

import './portfolio.scss';
import { Button } from '../button/button';

export const Portfolio = () => {
  const {stateInfo} = useContext(PortfolioContext);
  const {state, setState} = stateInfo;
  const portfolio = state.portfolio;
  
  const deleteCoin = (e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    const search = portfolio.find(el => el.name === target.id);
    const buff = portfolio.filter(el => el.name !== target.id);
    setState((prev) => ({
      ...prev,
      portfolio: buff,
      total: (state.total -= Number(search?.price) * Number(search?.amount)),
    }));
  }
  return (
    <div className="portfolio">
      {portfolio.length !== 0 && (
        <table className="portfolio__table">
          <tbody className="portfolio__body">
            {portfolio.map((el) => (
              <tr className="portfolio__row row" key={el.name}>
                <td className="row__item">{el.name}</td>
                <td className="row__item">{el.amount}</td>
                <td className="row__item">
                  <Button id={el.name} onClick={deleteCoin} view='square' variant='color' size='small' type='button'>
                    delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {portfolio.length === 0 && <p className="portfolio__info">empty</p>}
    </div>
  );
}