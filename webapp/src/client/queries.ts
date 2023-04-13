import { useQuery } from "react-query";
import { useWallet } from "../hooks/useWallet";
import { getCidUrl } from "../lib/web3storage";
import { BillMetadata, ConfigMetadata, Metadata } from "../lib/metadata";
import axios from 'axios';
import { useAccount, useProvider } from "wagmi";
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

const EmptyConfigMetadataInfo = {
  cid: null,
  metadata: {
    restaurantName: '',
    logoCID: '',
    primaryColor: '',
  }
};

// Hooks

export const useMetadataInfo = () => {
  const { contract } = useWallet();
  return useQuery('metadata', async () => {
    try {
      const res = await contract!.getMenu();
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
  }, { enabled: !!contract?.provider });
}

export const useCurrentBill = () => {
  const { address } = useAccount();
  const { contract } = useWallet();
  return useQuery(['currentBill', address], async () => {
    try {
      const bill = await contract!.getAccountCurrentBill(address!);
      if (!bill.exists) {
        return null;
      }
      return {
        id: bill.id,
        owner: bill.owner,
        exists: bill.exists,
        waiter: bill.waiter,
        menuVersion: bill.menuVersion,
        metadataCID: bill.metadataCID,
        status: bill.status,
        ordersTotal: bill.ordersTotal,
        createdAt: bill.createdAt,
      };
    } catch (error) {
      return null;
    }
  }, { enabled: !!contract?.provider && !!address, cacheTime: 0 });
}

export const useOrdersInfos = ({ billId }: { billId?: BigNumberish }) => {
  const { contract } = useWallet();
  return useQuery(['orderInfos', billId], () => {
    try {
      return contract!.getBillOrdersInfo(billId!);
    } catch (error) {
      return null;
    }
  }, { enabled: !!contract?.provider && !!billId && billId > BigNumber.from(0), cacheTime: 0});
}

export const useBillTotalAmount = ({ billId }: { billId?: BigNumberish }) => {
  const { contract } = useWallet();
  return useQuery(['billTotalAmount', billId], () => {
    try {
      return contract!.getBillTotalAmount(billId!);
    } catch (error) {
      return null;
    }
  }, { enabled: !!contract?.provider && billId !== undefined });
}

export const useBillMetadata = ({ billMetadataCid }: { billMetadataCid?: string }) => {
  return useQuery(['billMetadata', billMetadataCid], async () => {
    const { data: metadata } = await axios.get<BillMetadata>(getCidUrl(billMetadataCid!));
    return metadata;
  }, { enabled: !!billMetadataCid });
};

export const useAllOrdersInfos = ({ fromDate, toDate, refetchInterval=0 }: { fromDate?: BigNumberish, toDate?: BigNumberish, refetchInterval?: number }) => {
  const { contract } = useWallet();
  return useQuery(['allOrderInfos', fromDate, toDate], async () => {
    try {
      const ordersInfo = await contract!.getOrdersInfo({
        fromDate: fromDate || 0,
        toDate: toDate || 0,
      });
      return ordersInfo.map(oi => {
        const { bill: b } = oi;
        return {
          id: oi.id,
          createdAt: oi.createdAt,
          bill: {
            id: b.id,
            owner: b.owner,
            waiter: b.waiter,
            metadataCID: b.metadataCID,
            status: b.status,
            ordersTotal: b.ordersTotal,
            createdAt: b.createdAt,
          },
          lines: oi.lines.map(l => ({
            menuItemIdx: l.menuItemIdx,
            quantity: l.quantity,
          }))
        }
      }).reverse();
    } catch (error) {
      throw error;
    }
  }, { enabled: !!contract?.provider, cacheTime: 0, refetchInterval });
}


export const useAllBillsInfos = ({ fromDate, toDate, refetchInterval=0 }: { fromDate?: BigNumberish, toDate?: BigNumberish, refetchInterval?: number }) => {
  const { contract } = useWallet();
  return useQuery(['allBillsInfos', fromDate, toDate], async () => {
    try {
      const billsInfos = await contract!.getBillsInfo({
        fromDate: fromDate || 0,
        toDate: toDate || 0,
      });
      return billsInfos.map(billInfo => {
        
        const { bill: b } = billInfo;
        return {
          bill: {
            id: b.id,
            owner: b.owner,
            waiter: b.waiter,
            metadataCID: b.metadataCID,
            status: b.status,
            ordersTotal: b.ordersTotal,
            createdAt: b.createdAt,
          },
          orderInfos: billInfo.orderInfos.map(oi => ({
            lines: oi.lines.map(l => ({
              menuItemIdx: l.menuItemIdx,
              quantity: l.quantity,
            }))
          })),
          totalAmount: billInfo?.totalAmount,
        }
      }).reverse();
    } catch (error) {
      throw error;
    }
  }, { enabled: !!contract?.provider, cacheTime: 0, refetchInterval });
}

export const useContractBalance = () => {
  const { contract } = useWallet();
  return useQuery(['contractBalance', contract?.address], async () => {
    return contract!.provider.getBalance(contract!.address);
  }, { enabled: !!contract?.address && !!contract?.provider });
}

export const useMembers = () => {
  const { contract } = useWallet();
  return useQuery(['members', contract?.address], async () => {
    try {
      const members = await contract?.getMembers();
      return members?.map(m => ({
        account: m.account,
        role: m.role,
      }))
    } catch (error) {
      throw error;
    }
  }, { enabled: !!contract?.address && !!contract?.provider });
}

export const useOwner = () => {
  const { contract } = useWallet();
  return useQuery(['owner', contract?.address], async () => {
    try {
      return contract?.owner();
    } catch (error) {
      throw error;
    }
  }, { enabled: !!contract?.address && !!contract?.provider });
}

export const useConfigMetadataInfo = () => {
  const { contract } = useWallet();
  return useQuery('configMetadataInfo', async () => {
    try {
      const cid = await contract!.configCID();
      if (cid === '') {
        return EmptyConfigMetadataInfo;
      }
      const { data: metadata } = await axios.get<ConfigMetadata>(getCidUrl(cid));
      return {
        cid,
        metadata,
      }
    } catch (error) {
      return EmptyConfigMetadataInfo;
    }
  }, { enabled: !!contract?.provider });
}
