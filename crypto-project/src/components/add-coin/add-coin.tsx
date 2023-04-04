import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { PortfolioContext } from '../../context';
import { getCoin } from '../../api/request';

import './add-coin.scss';

type AddCoinProps = {
  stateModal: { isActiveModal: boolean; addCoin: string };
  setStateModal: Dispatch<
    SetStateAction<{
      isActivePortfolio: boolean;
      isActiveModal: boolean;
      addCoin: string;
    }>
  >;
};
export const AddCoin = ({ stateModal, setStateModal }: AddCoinProps) => {
  const valid = ["0", ".0", "0.", "."];
  const [value, setValue] = useState("");
  const { stateInfo } = useContext(PortfolioContext);
  const {state, setState} = stateInfo;
  const portfolio = state.portfolio;

  const inputPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStateModal(prev => ({...prev, isActiveModal: false }));
    const response = await getCoin(stateModal.addCoin);
    const newPrice = Number(response.data.data.priceUsd);
      if (portfolio.find((el) => el.name === stateModal.addCoin)) {
        const search = portfolio.find((el) => el.name === stateModal.addCoin);
        const buff = portfolio.filter((el) => el.name !== stateModal.addCoin);
        const obj = {
          name: stateModal.addCoin as string,
          amount: Number(value) + Number(search?.amount),
          price: newPrice,
        };
        buff.push(obj);
        setState((prev) => ({
          ...prev,
          portfolio: buff,
          total:
            state.total +
            (Number(value) + Number(search?.amount)) * newPrice -
            Number(search?.amount) * Number(search?.price),
        }));
      } else {
        const obj = {
          name: stateModal.addCoin as string,
          amount: Number(value),
          price: Number(response.data.data.priceUsd),
        };
        setState((prev) => ({
          ...prev,
          portfolio: [...state.portfolio, obj],
          total: state.total + Number(value) * newPrice,
        }));
      }
    setValue("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="form__name-coin">{stateModal.addCoin}</p>
      <input
        autoFocus
        type="number"
        step='any'
        placeholder="enter amount"
        className="form__input"
        value={value}
        onChange={inputPrice}
      />
      <button
        className="form__button"
        type='submit'
        disabled={!value || Number(value) < 0 || valid.includes(value) || Number.isNaN(Number(value)) ? true : false}
      >
        add
      </button>
    </form>
  );
};
