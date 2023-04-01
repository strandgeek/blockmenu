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
  const { status, connect, address } = useTron();
  return (
    <>
      {status === "NOT_INSTALLED" && (
        <div className="text-gray-500">
          Install the{" "}
          <a
            href="https://www.tronlink.org/dlDetails/"
            className="text-primary flex items-center"
          >
            TronLink Wallet <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </div>
      )}
      {status === "LOCKED" && (
        <div className="text-gray-500">Unlock your TronLink Wallet</div>
      )}
      {status === "READY" && (
        <button className="btn btn-primary" onClick={() => connect()}>
          <TronIcon className="h-5 w-5 mr-2" />
          Connect Wallet
        </button>
      )}
      {status === "CONNECTED" && (
        <div className="flex items-center">
          <img src={getIdenticonSrc(address!)} className="rounded-full h-8 w-8 mr-2" />
          {getShortAddress(address!)}
        </div>
      )}
    </>
  );
};
