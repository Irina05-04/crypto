import { Dispatch, FC, ReactNode, SetStateAction } from "react";

import './modal.scss';

type ModalWindowProps = {
    tittle: string,
    component: ReactNode,
    isActive: boolean,
    setIsActive: Dispatch<SetStateAction<boolean>>
}
export const ModalWindow:FC<ModalWindowProps> = ({tittle, component, isActive, setIsActive}) =>{
    
    const onHandleClick = (e: React.MouseEvent) => {
        if (e.currentTarget === e.target) {
        setIsActive(prev => !prev);
        }
    }

    return (
      <div className={isActive ? "modal" : "modal modal_none"} onClick={onHandleClick}>
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