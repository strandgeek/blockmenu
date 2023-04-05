import React, { FC, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useInterval } from "usehooks-ts";
import { tronContext, TronWalletStatus } from "../contexts/tron";
import ContractV1 from '../contracts/v1.json';

export interface TronProviderProps {
  children: React.ReactNode;
}

export const TronProvider: FC<TronProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [locked, setLocked] = useState(true);
  const [address, setAddress] = useState<string | null>(null);
  const [contract, setContract] = useState();

  const getWalletStatus = () => {
    const installed = !!window.tronWeb;
    const locked = installed && window.tronWeb.defaultAddress && !window.tronWeb.defaultAddress.base58;
    if(installed && !locked && window.tronWeb.defaultAddress) {
      setAddress(window.tronWeb.defaultAddress.base58);
    } else {
      setAddress(null);
    }
    setInstalled(installed);
    setLocked(locked);
    setLoading(false);
  }

  useEffect(() => {
    getWalletStatus();
  }, []);

  useEffect(() => {
    if (address) {
      const contract = window.tronWeb.contract(ContractV1.abi, 'TTYRW5q6m1VRZX89f7SemYvUXZmVAfupbL');
      setContract(contract);
    }
  }, [address]);

  useInterval(
    () => {
      getWalletStatus()
    },
    200,
  );

  const status: TronWalletStatus = useMemo(() => {
    if (!installed) {
      return 'NOT_INSTALLED';
    } else if (locked) {
      return 'LOCKED';
    } else if (address) {
      return 'CONNECTED';
    }
    return 'LOADING';
  }, [loading, installed, locked, address])


  const connect = async () => {
    try {
      const res = await window.tronLink.request({method: 'tron_requestAccounts'});
      if (res.code === 4001) {
        toast.error('User rejected the request');
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <tronContext.Provider value={{ address, tronWeb: window.tronWeb, status, connect, contract }}>
      {children}
    </tronContext.Provider>
  );
};
