import { createContext } from "react";
import { BlockMenuContract, ContractContext } from "../types/BlockMenuContract";

interface WalletContext {
  contract: ContractContext | null;
}

export const walletContext = createContext<WalletContext>({
  contract: null,
});
