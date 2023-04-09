import React, { FC, useEffect, useState } from 'react'
import { walletContext } from '../contexts/wallet'
import { ContractContext } from '../types/BlockMenuContract'
import ContractV1 from '../contracts/v1.json';
import { ethers } from 'ethersv5';
import { useSigner } from 'wagmi';

export interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  const [contract, setContract] = useState<ContractContext | null>(null);
  const { data: signer } = useSigner();
  useEffect(() => {
    const address = '0xdEB47D303F3AFaa911584542a8e1531188e8586F';
    const contract = new ethers.Contract(
      address,
      ContractV1.abi,
      signer || undefined,
    ) as unknown as ContractContext;
    setContract(contract);
  }, [signer]);
  return (
    <walletContext.Provider value={{ contract }}>
      {children}
    </walletContext.Provider>
  )
}
