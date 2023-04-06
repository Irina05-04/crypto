import { PortfolioRow } from "./portfolio-row";
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
      <tbody className="portfolio-table__body">
        {childrens.map(el => <PortfolioRow name={el.name} amount={el.amount} onClick={onClick}/>)}
      </tbody>
    </table>
  );
}