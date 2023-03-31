import { Dispatch, ReactNode, SetStateAction } from 'react';

import './modal.scss';

type ModalWindowProps = {
  tittle: string;
  component: ReactNode;
  isActive: {
    isActivePortfolio: boolean;
    isActiveModal: boolean;
  };
  setIsActive: Dispatch<
    SetStateAction<{
      isActivePortfolio: boolean;
      isActiveModal: boolean;
      addCoin: string;
    }>
  >;
};

export const ModalWindow = ({tittle, component, isActive, setIsActive}: ModalWindowProps) =>{
  const onHandleClick = (e: React.MouseEvent) => {
      if (e.currentTarget === e.target) {
        if(isActive.isActiveModal) {
          setIsActive(prev => ({...prev, isActiveModal: !isActive.isActiveModal}))
        }
        if(isActive.isActivePortfolio) {
          setIsActive(prev => ({...prev, isActivePortfolio: !isActive.isActivePortfolio}))
        }
      }
  }

  return (
    <div className="modal" onClick={onHandleClick}>
      <div className="modal__body">
        <div className="modal__wrapper">
          <p className="modal__title">{tittle}</p>
          <div className="modal__content">{component}</div>
        </div>
        <button className="modal__button" type="button" onClick={onHandleClick}>
          &times;
        </button>
      </div>
    </div>
  );
}