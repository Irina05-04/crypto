import React from "react";
import ICreateContext from "./interface/create-context";

export const PortfolioContext = React.createContext<ICreateContext>({} as ICreateContext);
