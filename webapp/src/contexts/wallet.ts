import { createContext } from "react";
import { BlockMenuContract } from "../types/BlockMenuContract";

interface WalletContext {
  provider: any
  contract: BlockMenuContract | null;
}

export const walletContext = createContext<WalletContext>({
  contract: null,
  provider: null
});
