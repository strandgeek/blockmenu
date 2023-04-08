import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import React, { FC } from "react";
import { useTron } from "../hooks/useTron";
import { getIdenticonSrc } from "../utils/getIdenticonSrc";
import { getShortAddress } from "../utils/getShortAddress";
import { TronIcon } from "./TronIcon";

export interface ConnectTronWalletButtonProps {}

export const ConnectTronWalletButton: FC<ConnectTronWalletButtonProps> = (
  props
) => {
  const { connected, connect, address } = useTron();
  return (
    <>
      {!connected ? (
        <button className="btn btn-primary" onClick={() => connect()}>
          <TronIcon className="h-5 w-5 mr-2" />
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
