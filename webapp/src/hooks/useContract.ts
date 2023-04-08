import { useSigner } from "wagmi"
import ContractV1 from '../contracts/v1.json';
import { ethers } from "ethersv5";
import { ContractContext } from "../types/BlockMenuContract";

export const useContract = () => {
  const { data: signer } = useSigner();
  const address = '0xfa59648F1acc607557d0796a7cFA5E25a743fCda';
  const contract = new ethers.Contract(
    address,
    ContractV1.abi,
    signer || undefined,
  ) as unknown as ContractContext;
  return contract;
}
