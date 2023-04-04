import { StoreApp } from "./store";

export default interface CreateContext {
  stateInfo: {
    state: StoreApp;
    setState: React.Dispatch<React.SetStateAction<StoreApp>>;
  };
}
