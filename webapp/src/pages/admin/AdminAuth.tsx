import React, { FC, useEffect, useState } from "react";
import LogoSrc from "../../assets/logo.svg";
import { useAccount, useConnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/react";
import { ethers } from "ethersv5";
import { useSessionStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";

export interface AdminAuthProps {}

export const AdminAuth: FC<AdminAuthProps> = (props) => {
  const [contractAddr, setContractAddr] = useSessionStorage('blockmenu-contract', '');
  const [contract, setContract] = useState<string>();
  const navigate = useNavigate();
  const { isConnected } = useAccount({
    onConnect: () => {
      if (contractAddr !== '') {
        navigate('/admin/menu');
      }
    },
  });
  const { open } = useWeb3Modal();
  const connect = () => {
    setContractAddr(contract || '');
    open();
  };
  return (
    <div className="w-screen h-screen bg-gray-50 pt-64 ">
      <div className="w-full text-center flex items-center justify-center mb-4">
        <img className="h-8 w-auto" src={LogoSrc} alt="TapMenu" />
      </div>
      <div>
        <div className="bg-white border shadow-xs max-w-lg mx-auto p-8">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Contract Address</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={contract}
              onChange={(e) => setContract(e.target.value)}
            />
            <div className="label-text-alt text-sm text-gray-500 mt-2">
              Don't have a Contract yet?{" "}
              <a
                className="text-primary hover:text-primary-focus active:text-primary"
                href="/deploy"
              >
                Deploy Now
              </a>
            </div>
            <button disabled={!ethers.utils.isAddress(contract!)} className="btn btn-primary btn-block mt-4" onClick={() => connect()}>
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
