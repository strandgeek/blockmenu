import { useQuery } from "react-query";
import { useContract } from "../hooks/useContract";
import { getCidUrl } from "../lib/web3storage";
import { Metadata } from "../lib/metadata";
import axios from 'axios';
import { useAccount } from "wagmi";
import { BigNumber, BigNumberish } from "ethersv5";

const EmptyMetadataInfo = {
  cid: null,
  metadata: {
    name: '',
    menu: {
      categories: [],
    }
  }
}

// Hooks

export const useMetadataInfo = () => {
  const contract = useContract();
  return useQuery('metadata', async () => {
    try {
      const res = await contract.getMenu();
      const menu = res[0];
      if (!menu.exists || menu.metadataCID === '') {
        return EmptyMetadataInfo;
      }
      const cid = menu.metadataCID;
      const { data: metadata } = await axios.get<Metadata>(getCidUrl(cid));
      return {
        cid,
        metadata,
      }
    } catch (error) {
      return EmptyMetadataInfo;
    }
  }, { enabled: !!contract.provider });
}

export const useCurrentBill = () => {
  const { address } = useAccount();
  const contract = useContract();
  return useQuery(['currentBill', address], async () => {
    try {
      const bill = await contract.getAccountCurrentBill(address!);
      if (!bill.exists) {
        return null;
      }
      return bill;
    } catch (error) {
      return null;
    }
  }, { enabled: !!contract.provider && !!address, cacheTime: 0 });
}

export const useOrdersInfos = ({ billId }: { billId?: BigNumberish }) => {
  const contract = useContract();
  return useQuery(['orderInfos', billId], () => {
    try {
      return contract.getBillOrdersInfo(billId!);
    } catch (error) {
      return null;
    }
  }, { enabled: !!contract.provider && !!billId && billId > BigNumber.from(0), cacheTime: 0});
}

export const useBillTotalAmount = ({ billId }: { billId?: BigNumberish }) => {
  const contract = useContract();
  return useQuery(['billTotalAmount', billId], () => {
    try {
      return contract.getBillTotalAmount(billId!);
    } catch (error) {
      return null;
    }
  }, { enabled: !!contract.provider && billId !== undefined });
}
