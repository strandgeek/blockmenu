import React, { FC, useEffect, useState } from "react";
import { tronContext } from "../contexts/tron";

export interface TronProviderProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    tronWeb: any;
  }
}

export const TronProvider: FC<TronProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [locked, setLocked] = useState(true);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const installed = !!window.tronWeb;
    const locked = installed && !window.tronWeb.defaultAddress.base58;
    if(!locked) {
      setAddress(window.tronWeb.defaultAddress.base58);
    }
    setInstalled(installed);
    setLocked(locked);
    setLoading(false);
  }, []);

  const connect = async () => {
    // @ts-ignore
    const res = await window.tronLink.request({method: 'tron_requestAccounts'});
    console.log(res);
  };

  return (
    <tronContext.Provider value={{ address, tronWeb: null }}>
      <button onClick={connect}>Connect</button>
      {children}
    </tronContext.Provider>
  );
};
