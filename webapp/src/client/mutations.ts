import { useMutation } from "react-query";
import { useTron } from "../hooks/useTron";
import { BillMetadata, Metadata, generateBillMetadataCID, generateMetadataCID } from "../lib/metadata";
import { waitFor } from "../utils/waitFor";
import { waitForTxn } from "../utils/waitForTxn";
import { getMetadataInfo } from "./queries";
import { OrderItem } from "../providers/OrderProvider";

// Functions

export const setMetadataInfo = (c?: any) => async (metadata: Metadata): Promise<{ cid: string | null, metadata: Metadata }> => {
  const cid = await generateMetadataCID(metadata)
  const { tronWeb } = window;
  // Configure Menu for On-Chain data
  let idx = 0;
  const items: number[][] = [];
  metadata.menu.categories.forEach(c => {
    c.items.forEach(i => {
      items.push([tronWeb.toSun(i.price)]);
      idx++;
    })
  });

  await c.createMenu(cid, items).send();
  await waitFor(() => getMetadataInfo(c)(), (m) => m.cid === cid);
  return {
    cid,
    metadata,
  }
}

export const createOrder = (c?: any, address?: string | null) => async (orderItems: OrderItem[]): Promise<boolean> => {
  const getOrdersCount = async () => {
    try {
      const bill = await c.getAccountCurrentBill(address).call();
      return bill.ordersTotal;
    } catch (error) {
      console.log(error);
    };
    return 0;
  }
  // Fetching the billOrders so we can use it as stop condition on waitFor
  const currentOrdersCount = await getOrdersCount();

  const ordersList: number[][] = [];
  orderItems.forEach(oi => {
    ordersList.push([oi.item.id, oi.quantity]);
  });
  try {
    await c.createOrder(ordersList).send();
    await waitFor(getOrdersCount, (count) => count > currentOrdersCount);
  } catch (error) {
    throw error;
  }
  return true;
}

export const createBill = (c?: any, address?: string | null) => async (metadata: BillMetadata): Promise<boolean> => {
  const getBill = async () => {
    try {
      const bill = await c.getAccountCurrentBill(address).call();
      return bill;
    } catch (error) {
      console.log(error);
    };
    return 0;
  }
  // Fetching the billOrders so we can use it as stop condition on waitFor
  const currentBill = await getBill();
  try {
    const cid = await generateBillMetadataCID(metadata)
    await c.createBill(cid).send();
    await waitFor(getBill, (bill) => bill.id != currentBill.id);
  } catch (error) {
    throw error;
  }
  return true;
}



// Hooks

export const useSetMetadataInfoMutation = () => {
  const { contract } = useTron()
  return useMutation({
    mutationFn: (metadata: Metadata) => {
      return setMetadataInfo(contract)(metadata)
    },
  })
}

export const useCreateBillMutation = () => {
  const { contract, address } = useTron()
  return useMutation({
    mutationFn: (metadata: BillMetadata) => {
      return createBill(contract, address)(metadata)
    },
  })
}

export const useCreateOrderMutation = () => {
  const { contract, address } = useTron()
  return useMutation({
    mutationFn: ({ orderItems }: { orderItems: OrderItem[] }) => {
      return createOrder(contract, address)(orderItems)
    },
  })
}
