import { Button } from "../button/button";
import './portfolio-table.scss';

type PortfolioRowProps = {
    name: string,
    amount: number,
    onClick?: (e: React.MouseEvent) => void;
}
export const PortfolioRow = ({name, amount, onClick}:PortfolioRowProps) => {
    return (
      <tr className="portfolio__row row" key={name}>
        <td className="row__item">{name}</td>
        <td className="row__item">{amount}</td>
        <td className="row__item">
          <Button
            id={name}
            onClick={onClick}
            view="square"
            variant="color"
            size="small"
            type="button"
          >
            delete
          </Button>
        </td>
      </tr>
    );
}