import React, { FC, useEffect, useState } from 'react'
import { walletContext } from '../contexts/wallet'
import { ContractContext } from '../types/BlockMenuContract'
import ContractV1 from '../contracts/v1.json';
import { ethers } from 'ethersv5';
import { useSigner } from 'wagmi';
import { useSessionStorage } from 'usehooks-ts';

export interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  const [contractAddr] = useSessionStorage('blockmenu-contract', '');
  const [contract, setContract] = useState<ContractContext | null>(null);
  const { data: signer } = useSigner();
  useEffect(() => {
    if (contractAddr) {
      const contract = new ethers.Contract(
        contractAddr,
        ContractV1.abi,
        signer || undefined,
      ) as unknown as ContractContext;
      setContract(contract);
    }
  }, [signer, contractAddr]);
  return (
    <walletContext.Provider value={{ contract }}>
      {children}
    </walletContext.Provider>
  )
}
