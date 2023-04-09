import React, { FC } from "react";
import { getIdenticonSrc } from "../utils/getIdenticonSrc";
import { getShortAddress } from "../utils/getShortAddress";

export interface AddressInfoProps {
  address: string;
  short?: boolean
}

export const AddressInfo: FC<AddressInfoProps> = ({ address, short }) => {
  const addrLabel = short ? getShortAddress(address): address
  return (
    <div className="flex items-center">
      <div className="avatar">
        <div className="rounded-full w-6 h-6 mr-2">
          <img
            src={getIdenticonSrc(address)}
            width={24}
            height={24}
            alt="Address"
          />
        </div>
      </div>
      <div>{addrLabel}</div>
    </div>
  );
};
