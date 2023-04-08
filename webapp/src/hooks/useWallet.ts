import { useContext } from "react";
import { walletContext } from "../contexts/wallet";

export const useWallet = () => useContext(walletContext);
