import { TStoreApp } from '../type/store';

export default interface ICreateContext {
    stateInfo: {
        state: TStoreApp,
        setState: React.Dispatch<React.SetStateAction<TStoreApp>>
    } 
}