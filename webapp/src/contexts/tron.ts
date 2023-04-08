import { createContext } from "react";
import { BlockMenuWrapper } from "../wrapper/BlockMenuWrapper";

interface TronContext {
  address: string | null;
  tronWeb: any;
  connect: () => Promise<void>;
  connected: boolean;
  contract: any;
  wrapper: BlockMenuWrapper | null;
}

export const tronContext = createContext<TronContext>({
  address: null,
  tronWeb: null,
  connect: async () => {},
  connected: false,
  contract: null,
  wrapper: null,
});
