import { createContext } from "react";


interface TronContext {
  address: string | null;
  tronWeb: any;
}

export const tronContext = createContext<TronContext>({
  address: null,
  tronWeb: null,
});
