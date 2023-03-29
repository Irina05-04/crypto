import { ChangeEventHandler, FC, FormEventHandler, useState } from 'react';

import './add-coin.scss';

type AddCoinProps = {
    name: string | null;
}
export const AddCoin:FC<AddCoinProps> = ({name}) => {
    const [value, setValue] = useState('');
    const inputPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^\\.0-9]/g,'');
        setValue(value);

    }

    return (
      <div className="form">
        <p className="form__name-coin">{name}</p>
        <input
          type="text"
          placeholder="enter amount"
          className="form__input"
          value={value}
          onChange={inputPrice}
        />
        <button className="form__button">add</button>
      </div>
    );
}