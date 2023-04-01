import React, { FC, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useInterval } from "usehooks-ts";
import { tronContext, TronWalletStatus } from "../contexts/tron";

export interface TronProviderProps {
  children: React.ReactNode;
}

export const TronProvider: FC<TronProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [locked, setLocked] = useState(true);
  const [address, setAddress] = useState<string | null>(null);

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
    <tronContext.Provider value={{ address, tronWeb: null, status, connect }}>
      {children}
    </tronContext.Provider>
  );
};
