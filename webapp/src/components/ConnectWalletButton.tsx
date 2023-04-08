import { FC } from "react";
import { getIdenticonSrc } from "../utils/getIdenticonSrc";
import { getShortAddress } from "../utils/getShortAddress";
import { useAccount, useConnect } from "wagmi";
import { metaMaskConnector } from "../lib/wagmi";

export interface ConnectWalletButtonProps {}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = (
  props
) => {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect({
    connector: metaMaskConnector,
  });
  return (
    <>
      {!isConnected ? (
        <button className="btn btn-primary" onClick={() => connect()}>
          Connect Wallet
        </button>
      ): (
        <div className="flex items-center">
          <img src={getIdenticonSrc(address!)} className="rounded-full h-8 w-8 mr-2" />
          {getShortAddress(address!)}
        </div>
      )}
    </>
  );
};
