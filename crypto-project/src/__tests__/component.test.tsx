import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import { List } from '../components/list/list';
import { topCoins } from '../mock';
import { Input } from '../components/input/input';
import { Button } from '../components/button/button';
import { ModalWindow } from '../components/modal/modal';
import userEvent from '@testing-library/user-event';
import { PortfolioRow } from '../components/portfolio-table/portfolio-row';
import { PortfolioTable } from '../components/portfolio-table/portfolio-table';


describe("list test", () => {
  it("should have list", () => {
    render(<List childrens={topCoins} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText(/Bitcoin/)).toBeInTheDocument();
    expect(screen.getByText(/Ethereum/)).toBeInTheDocument();
    expect(screen.getByText(/Tether/)).toBeInTheDocument();
  });
  it("should have empty list", () => {
    render(<List childrens={null} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toBeNull;
  });
  it("List snapshot", () => {
    const list = render(<List childrens={topCoins} />);
    expect(list).toMatchSnapshot();
  });
  it("empty list snapshot", () => {
    const list = render(<List childrens={null} />);
    expect(list).toMatchSnapshot();
  });
});

describe('button test', () => {
    it('should have large, square, color button', () => {
        render(
          <Button
            children="add"
            type="button"
            variant="color"
            view="square"
            size="large"
          />
        );
        const button = screen.getByRole('button', { name: /add/i });
        expect(button).toHaveClass("color", "square", "large");
        expect(button).toBeEnabled();
    });
    it('should round button', () => {
        render(
          <Button
            children="add"
            type="button"
            variant="color"
            view="round"
            size="round-size"
          />
        );
        const button = screen.getByRole('button', { name: /add/i });
        expect(button).toHaveClass("color", "round", "round");
        expect(button).toBeEnabled();
    });
    it('should have disabled button', () => {
        render(
          <Button
            children="add"
            type="button"
            variant="color"
            view="square"
            disabled={true}
          />
        );
        const button = screen.getByRole('button', { name: /add/i })
        expect(button).toBeDisabled();
    });
    it('List snapshot', () => {
        const button = render(
          <Button
            children="add"
            type="button"
            variant="color"
            view="square"
          />
        );
        expect(button).toMatchSnapshot();
    })
})

describe('input test', () => {
    const onChange = jest.fn();
    const setup = () => {
      const props = {
        type: "number",
        placeholder: "enter amount",
        step: "any",
        onChange: onChange,
      };
      const utils = render(<Input {...props}/>);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      return {
        input,
        ...utils,
      }
    }
    it('should have input with empty value', () => {
        const {input} = setup();
        expect(input).toHaveClass('input');
        expect(screen.getByPlaceholderText('enter amount')).toBeInTheDocument();
        expect(input.step).toEqual('any');
        expect(input.type).toEqual('number');
        expect(input).toHaveFocus();
        expect(input.value).toBe("");
    });
    it("change input value", () => {
      const { input } = setup();
      fireEvent.change(input, { target: { value: "2.2" } });
      expect(input.value).toBe("2.2");
    });
    it("should value to be deleted", () => {
      const { input } = setup();
      fireEvent.change(input, { target: { value: "2.2" } });
      expect(input.value).toBe("2.2"); 
      fireEvent.change(input, { target: { value: "" } });
      expect(input.value).toBe("");
    });
    it("check the type of props", () => {
      const props = {
        type: "number",
        placeholder: "enter amount",
        onChange: onChange,
      };
      const InputComponent = <Input {...props} />;
      expect(InputComponent.props.placeholder).toBe("enter amount");
      expect(InputComponent.props.type).toBe("number");
    });
    it("input snapshot", () => {
      const { input } = setup();
      expect(input).toMatchSnapshot();
    });
})

describe('modal window test', () => {
  const setup = () => {
    const props = {
      tittle: "modal window",
      component: <input data-testid="input"/>,
      isActive: {
        isActivePortfolio: false,
        isActiveModal: true,
      },
      setIsActive: jest.fn()
    };
    const utils = render(<ModalWindow {...props}/>);
    const modal = screen.getByTestId('modal');
    return {
      modal,
      ...utils,
    }
  }
  const setupPortfolio = () => {
    const props = {
      tittle: "modal window",
      component: <input data-testid="input"/>,
      isActive: {
        isActivePortfolio: true,
        isActiveModal: false,
      },
      setIsActive: jest.fn()
    };
    const utils = render(<ModalWindow {...props}/>);
    const modal = screen.getByTestId('modal');
    return {
      modal,
      ...utils,
    }
  }
  it('should open/close modal window', () => {
    const { modal } = setup();
    expect(modal).toHaveClass("modal");
    expect(screen.getByText("modal window")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
    const button = screen.getByText('×');
    userEvent.click(button);
    expect(screen.queryByText("modal window")).toBeNull;
  });
  it('should open/close modal window for portfolio', () => {
    const { modal } = setupPortfolio();
    expect(modal).toHaveClass("modal");
    expect(screen.getByText("modal window")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
    const button = screen.getByText('×');
    userEvent.click(button);
    expect(screen.queryByText("modal window")).toBeNull;
  });
  it("modal snapshot", () => {
    const { modal } = setup();
    expect(modal).toMatchSnapshot();
  });
})

describe('portdolio table test', () => {
  const setupRow = () => {
    const props = {
      name: "bitcoin",
      amount: 2,
      onClick: jest.fn(),
    };
    const utils = render(
      <table>
        <tbody>
          <PortfolioRow {...props} />
        </tbody>
      </table>
    );
    const row = screen.getByRole('row');
    return {
      row,
      ...utils,
    }
  }
  const setupTable = () => {
    const props = {
      childrens: [
        {
          name: 'bitcoin',
          amount: 2,
        },
        {
          name: 'cartana',
          amount: 1.1,
        }
      ],
      onClick: jest.fn(),
    };
    const utils = render(<PortfolioTable {...props}/>);
    const table = screen.getByRole('table');
    return {
      table,
      ...utils,
    }
  }
  it('should have row', () => {
    const { row } = setupRow();
    expect(row).toHaveClass("row");
    expect(screen.getByText('bitcoin')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  it('should have table', () => {
    const { table } = setupTable();
    expect(table).toHaveClass("portfolio-table");
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText('bitcoin')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('cartana')).toBeInTheDocument();
  });
  it("table snapshot", () => {
    const { table } = setupTable();
    expect(table).toMatchSnapshot();
  });
})
