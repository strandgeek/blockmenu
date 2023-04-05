import axios from "axios";
import { useQuery } from "react-query";
import { useTron } from "../hooks/useTron";
import { Metadata } from "../lib/metadata";
import { getCidUrl } from "../lib/web3storage";

const EmptyMetadataInfo = {
  cid: null,
  metadata: {
    name: '',
    menu: {
      categories: [],
    }
  }
}

// Queries

export const getMetadataInfo = (c?: any) => async (): Promise<{ cid: string | null, metadata: Metadata }> => {
  try {
    const menuRes = await c.getMenu().call();

    const [menu, items] = menuRes;

    if (menu.metadataCID === '' || menu.itemsTotal.toNumber() === 0 || !menu.exists) {
      return EmptyMetadataInfo;
    }

    const cid = menu.metadataCID;
  
    // Fetch Metadata JSON on IPFS Gateway
    const { data: metadata } = await axios.get<Metadata>(getCidUrl(cid));
    return {
      cid,
      metadata,
    }
  } catch (error: any) {
    console.log(error);
    return EmptyMetadataInfo;
  }
}

export const getCurrentBill = (c?: any, address?: string | null) => async (): Promise<any> => {
  try {
    const currentBill = await c.getAccountCurrentBill(address).call();
    console.log(currentBill);
    if (!currentBill.exists) {
      return null;
    }
    // TODO: Parse and create a type for Bill here
    return currentBill;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

export const getBillOrdersInfo = (c?: any, billId?: number) => async (): Promise<any> => {
  try {
    console.log({ billId });
    if (!billId) {
      return [];
    }
    const ordersInfo = await c.getBillOrdersInfo(billId).call();
    console.log({ ordersInfo });
    // TODO: Parse and create a type for OrdersInfo here
    return ordersInfo;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

export const getBillTotalAmount = (c?: any, billId?: number) => async (): Promise<number | null> => {
  try {
    if (!billId) {
      return null;
    }
    const totalAmount = await c.getBillTotalAmount(billId).call();
    return totalAmount?.toNumber() || null;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}


// Hooks

export const useMetadataInfo = () => {
  const { contract } = useTron();
  return useQuery('metadata', getMetadataInfo(contract), { enabled: !!contract, staleTime: 10 * (60 * 1000) });
}

export const useCurrentBill = () => {
  const { contract, address } = useTron();
  return useQuery('currentBill', getCurrentBill(contract, address), { enabled: !!contract, staleTime: 10 * (60 * 1000) });
}

export const useOrdersInfos = ({ billId }: { billId?: number }) => {
  const { contract } = useTron();
  return useQuery(['ordersInfo', billId], getBillOrdersInfo(contract, billId), { enabled: typeof billId !== undefined && !!contract, staleTime: 10 * (60 * 1000) });
}

export const useBillTotalAmount = ({ billId }: { billId?: number }) => {
  const { contract } = useTron();
  return useQuery(['billTotalAmount', billId], getBillTotalAmount(contract, billId), { enabled: typeof billId !== undefined && !!contract, staleTime: 10 * (60 * 1000) });
}
