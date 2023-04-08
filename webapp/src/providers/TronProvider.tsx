import React, { FC, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { tronContext } from "../contexts/tron";
import ContractV1 from '../contracts/v1.json';
import { BlockMenuWrapper, createBlockMenuTronWrapper } from "../wrapper/BlockMenuWrapper";
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';
// @ts-ignore
import TronWeb from 'tronweb';

export interface TronProviderProps {
  children: React.ReactNode;
}

const createTronWeb = () => {
  const tronWeb = new TronWeb({ 
    fullHost: 'https://api.shasta.trongrid.io',
  });
  // Allowing Anonymous call for getters
  tronWeb.setAddress('410000000000000000000000000000000000000000');
  return tronWeb;
}

export const TronProvider: FC<TronProviderProps> = ({ children }) => {
  const [contract, setContract] = useState();
  const [wrapper, setWrapper] = useState<BlockMenuWrapper | null>(null);
  const adapter = useMemo(() => new TronLinkAdapter({  }), []);
  const tronWeb = useMemo(() => createTronWeb(), []);

  const { address, connected } = adapter;


  useEffect(() => {
    // alert('ok');
  }, [adapter]);

  useEffect(() => {
    if (address && adapter) {
      tronWeb.setAddress(address);
      const contract = tronWeb.contract(ContractV1.abi, 'TTYRW5q6m1VRZX89f7SemYvUXZmVAfupbL');
      setContract(contract);
      const wrapper = createBlockMenuTronWrapper({
        tronWeb: tronWeb,
        contractAddress: 'TTYRW5q6m1VRZX89f7SemYvUXZmVAfupbL',
        adapter,
      });
      setWrapper(wrapper);
    }
  }, [address, adapter]);


  const connect = async () => {
    // @ts-ignore
    // await adapter.switchChain()
    await adapter.connect();
    await adapter.switchChain('0x94a9059e')
  }

  return (
    <tronContext.Provider value={{ address, tronWeb: window.tronWeb, connected: adapter.connected, connect, contract, wrapper }}>
      {children}
      <button onClick={() => adapter.switchChain('0x94a9059e')}>ChangeChain</button>
    </tronContext.Provider>
  );
};
