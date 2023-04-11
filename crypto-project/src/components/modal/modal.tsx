import { Dispatch, ReactNode, SetStateAction } from 'react';

import './modal.scss';
import { Button } from '../button/button';

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
    <div className="modal" onClick={onHandleClick} data-cy="modal">
      <div className="modal__body">
        <div className="modal__wrapper">
          <p className="modal__title">{tittle}</p>
          <div className="modal__content">{component}</div>
        </div>
        <div className="modal__button" data-cy="modal-close">
          <Button type="button" onClick={onHandleClick} view="round" variant="transparent" size='round-size'>
            &times;
          </Button>
        </div>
      </div>
    </div>
  );
}