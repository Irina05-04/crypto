import React from "react";
import ICreateContext from "./models/create-context";

export const PortfolioContext = React.createContext<ICreateContext>({} as ICreateContext);
