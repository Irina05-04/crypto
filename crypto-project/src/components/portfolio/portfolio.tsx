import { useContext } from 'react';
import { PortfolioContext } from '../../context';
import { PortfolioTable } from '../portfolio-table/portfolio-table';
import './portfolio.scss';

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
    <div className="portfolio" data-cy="portfolio">
      {portfolio.length !== 0 && (
        <PortfolioTable childrens={portfolio} onClick={deleteCoin} />
      )}
      {portfolio.length === 0 && (
        <p className="portfolio__info" data-cy="portfolio-empty">
          empty
        </p>
      )}
    </div>
  );
}