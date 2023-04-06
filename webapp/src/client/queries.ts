import { useQuery } from "react-query";
import { useTron } from "../hooks/useTron";

// Hooks

export const useMetadataInfo = () => {
  const { wrapper } = useTron();
  return useQuery('metadata', () => wrapper?.getMetadataInfo(), { enabled: !!wrapper, staleTime: 10 * (60 * 1000) });
}

export const useCurrentBill = () => {
  const { wrapper, address } = useTron();
  return useQuery('currentBill', () => wrapper?.getAccountCurrentBill(address || ''), { enabled: !!wrapper, staleTime: 10 * (60 * 1000) });
}

export const useOrdersInfos = ({ billId }: { billId?: bigint }) => {
  const { wrapper } = useTron();
  const enabled = !!wrapper && typeof billId !== undefined && billId! > -1n;
  return useQuery(['ordersInfo', billId], () => wrapper?.getBillOrdersInfo(billId || -1n), { enabled, staleTime: 10 * (60 * 1000) });
}

export const useBillTotalAmount = ({ billId }: { billId?: bigint }) => {
  const { wrapper } = useTron();
  const enabled = !!wrapper && typeof billId !== undefined && billId! > -1n;
  return useQuery(['billTotalAmount', billId], () => wrapper?.getBillTotalAmount(billId || -1n), { enabled, staleTime: 10 * (60 * 1000) });
}
