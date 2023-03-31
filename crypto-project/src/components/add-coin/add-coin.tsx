import { Dispatch, SetStateAction, useContext, useState } from "react";
import axios from 'axios';
import { PortfolioContext } from '../../context';
import { URL } from '../../const';

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
    const value = e.target.value.replace(/[^\\.0-9]/g, "");
    setValue(value);
  };

  const addCoins = () => {
    setStateModal(prev => ({...prev, isActiveModal: false }));
    axios.get(`${URL}/assets/${stateModal.addCoin}`).then(({ data }) => {
      if (portfolio.find((el) => el.name === stateModal.addCoin)) {
        const search = portfolio.find((el) => el.name === stateModal.addCoin);
        const buff = portfolio.filter((el) => el.name !== stateModal.addCoin);
        const obj = {
          name: stateModal.addCoin as string,
          amount: Number(value) + Number(search?.amount),
          price: Number(data.data.priceUsd),
        };
        buff.push(obj);
        setState((prev) => ({
          ...prev,
          portfolio: buff,
          total:
            state.total +
            (Number(value) + Number(search?.amount)) *
              Number(data.data.priceUsd) -
            Number(search?.amount) * Number(search?.price),
        }));
      } else {
        const obj = {
          name: stateModal.addCoin as string,
          amount: Number(value),
          price: Number(data.data.priceUsd),
        };
        setState((prev) => ({
          ...prev,
          portfolio: [...state.portfolio, obj],
          total: (state.total +
            Number(value) * Number(data.data.priceUsd))
        }));
      }
    });
    setValue("");
  };

  return (
    <div className="form">
      <p className="form__name-coin">{stateModal.addCoin}</p>
      <input
        autoFocus
        type="text"
        placeholder="enter amount"
        className="form__input"
        value={value}
        onChange={inputPrice}
      />
      <button
        className="form__button"
        disabled={!value || valid.includes(value) ? true : false}
        onClick={addCoins}
      >
        add
      </button>
    </div>
  );
};
