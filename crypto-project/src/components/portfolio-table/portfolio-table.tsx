import { PortfolioRow } from './portfolio-row';
import './portfolio-table.scss';

type PortfolioTableProps = {
    childrens: {
        name: string,
        amount: number,
    }[],
    onClick?: (e: React.MouseEvent) => void;
}
export const PortfolioTable = ({childrens, onClick}: PortfolioTableProps) => {
  return (
    <table className="portfolio-table">
      <tbody className="portfolio-table__body" data-cy="portfolio-table__body">
        {childrens.map((el) => (
          <PortfolioRow
            key={el.name}
            name={el.name}
            amount={el.amount}
            onClick={onClick}
          />
        ))}
      </tbody>
    </table>
  );
}