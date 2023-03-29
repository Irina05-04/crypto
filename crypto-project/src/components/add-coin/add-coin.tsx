import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { PortfolioContext } from '../../context';
import {URL} from '../../const';

import './add-coin.scss';

type AddCoinProps = {
    name: string | null;
    setActive: Dispatch<SetStateAction<boolean>>,
}
export const AddCoin:FC<AddCoinProps> = ({name, setActive}) => {
    const valid = ['0', '.0', '0.', '.'];
    const [value, setValue] = useState('');
    const {coinsPortfolio, totalPrice} = useContext(PortfolioContext);
    const {portfolio, setPortfolio} = coinsPortfolio;
    const {total, setTotal} = totalPrice;
    const inputPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\\.0-9]/g,'');
        setValue(value);
    }

    const addCoins = () => {
        setActive(false);
        axios.get(`${URL}/assets/${name}`)
        .then(({data}) => {
            if (portfolio.find(el => el.name === name)){
                const search = portfolio.find(el => el.name === name);
                const buff = portfolio.filter(el => el.name !== name);
                const obj = {
                    name: name as string,
                    amount: Number(value) + Number(search?.amount),
                    price: Number(data.data.priceUsd),
                }
                buff.push(obj)
                setPortfolio(buff);
            } else {
              const obj = {
                name: name as string,
                amount: Number(value),
                price: Number(data.data.priceUsd),
              };
              setPortfolio([...portfolio, obj]);
            }
            localStorage.setItem("total", (total + Number(value) * Number(data.data.priceUsd)).toString());
            setTotal(prev => prev += Number(value) * Number(data.data.priceUsd));
        })
        setValue('');
    }

    useEffect(() => {
        localStorage.setItem('store', JSON.stringify(portfolio));
    }, [portfolio]);
      
    return (
      <div className="form">
        <p className="form__name-coin">{name}</p>
        <input
          autoFocus
          type="text"
          placeholder="enter amount"
          className="form__input"
          value={value}
          onChange={inputPrice}
        />
        <button className="form__button" disabled={!value || valid.includes(value) ? true : false} onClick={addCoins}>add</button>
      </div>
    );
}