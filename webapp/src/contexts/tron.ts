import { createContext } from "react";

export type TronWalletStatus = 'LOADING' | 'NOT_INSTALLED' | 'LOCKED' | 'READY' | 'CONNECTED';

interface TronContext {
  status: TronWalletStatus,
  address: string | null;
  tronWeb: any;
  connect: () => Promise<void>;
}

export const tronContext = createContext<TronContext>({
  status: 'LOADING',
  address: null,
  tronWeb: null,
  connect: async () => {},
});
