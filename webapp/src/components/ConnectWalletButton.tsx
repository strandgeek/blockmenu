import { FC } from "react";
import { getIdenticonSrc } from "../utils/getIdenticonSrc";
import { getShortAddress } from "../utils/getShortAddress";
import { useAccount, useConnect } from "wagmi";
import { connectors, metaMaskConnector } from "../lib/wagmi";
import { Web3Button, useWeb3Modal } from "@web3modal/react";

export interface ConnectWalletButtonProps {}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = (
  props
) => {
  const { isConnected, address } = useAccount();
  const { open } = useWeb3Modal();
  const connect = () => {
    if (!isConnected) {
      open();
    }
  };
  return (
    <>
      {!isConnected ? (
        <div>
          <button className="btn btn-primary"onClick={() => connect()}>
            Connect Wallet
          </button>
        </div>
      ): (
        <div className="flex items-center">
          <img src={getIdenticonSrc(address!)} className="rounded-full h-8 w-8 mr-2" />
          {getShortAddress(address!)}
        </div>
      )}
    </>
  );
};
