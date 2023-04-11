import { FC } from "react";
import { getIdenticonSrc } from "../utils/getIdenticonSrc";
import { getShortAddress } from "../utils/getShortAddress";
import { useAccount, useConnect } from "wagmi";
import { connectors, metaMaskConnector } from "../lib/wagmi";
import { Web3Button } from "@web3modal/react";

export interface ConnectWalletButtonProps {}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = (
  props
) => {
  const { isConnected, address } = useAccount();
  // const { connect } = useConnect({
  //   connector: connectors.find(c => c.),
  // });
  return (
    <>
      {!isConnected ? (
        <div>
          oi
          <Web3Button />
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
