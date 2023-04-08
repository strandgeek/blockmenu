import { useMutation } from "react-query";
import { useTron } from "../hooks/useTron";
import { BillMetadata, Metadata } from "../lib/metadata";
import { OrderItem } from "../providers/OrderProvider";

// Hooks

export const useSetMetadataInfoMutation = () => {
  const { wrapper } = useTron()
  return useMutation({
    mutationFn: (metadata: Metadata) => {
      if (!wrapper) {
        throw new Error('Wallet not connected');
      }
      return wrapper.setMetadataInfo(metadata)
    },
  })
}

export const useCreateBillMutation = () => {
  const { wrapper } = useTron()
  return useMutation({
    mutationFn: (metadata: BillMetadata) => {
      if (!wrapper) {
        throw new Error('Wallet not connected');
      }
      return wrapper.createBill(metadata)
    },
  })
}

export const useCreateOrderMutation = () => {
  const { wrapper } = useTron()
  return useMutation({
    mutationFn: ({ orderItems }: { orderItems: OrderItem[] }) => {
      if (!wrapper) {
        throw new Error('Wallet not connected');
      }
      return wrapper.createOrder(orderItems);
    },
  })
}

export const usePayBill = () => {
  const { wrapper } = useTron()
  return useMutation({
    mutationFn: ({ billId, value }: { billId: bigint, value: bigint }) => {
      if (!wrapper) {
        throw new Error('Wallet not connected');
      }
      return wrapper.payBill(billId, value)
    },
  })
}
