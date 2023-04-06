import { createContext } from "react";
import { BlockMenuWrapper } from "../wrapper/BlockMenuWrapper";

export type TronWalletStatus = 'LOADING' | 'NOT_INSTALLED' | 'LOCKED' | 'READY' | 'CONNECTED';

interface TronContext {
  status: TronWalletStatus,
  address: string | null;
  tronWeb: any;
  connect: () => Promise<void>;
  contract: any;
  wrapper: BlockMenuWrapper | null;
}

export const tronContext = createContext<TronContext>({
  status: 'LOADING',
  address: null,
  tronWeb: null,
  connect: async () => {},
  contract: null,
  wrapper: null,
});
