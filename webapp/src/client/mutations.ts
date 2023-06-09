import { useMutation } from "react-query";
import { BillMetadata, ConfigMetadata, Metadata, generateMetadataCID } from "../lib/metadata";
import { OrderItem } from "../providers/OrderProvider";
import { useWallet } from "../hooks/useWallet";
import { useSigner } from "wagmi";
import { CreateMenuRequest } from "../types/BlockMenuContract";
import { BigNumber, BigNumberish, ethers } from "ethers";

// Hooks

export const useSetMetadataInfoMutation = () => {
  const { data: signer } = useSigner();
  const { contract } = useWallet();
  return useMutation({
    mutationFn: async (metadata: Metadata) => {
      if (!contract?.provider || !signer) {
        throw new Error('Wallet not connected');
      }
      // Configure Menu for On-Chain data
      let idx = 0;
      const items: CreateMenuRequest[] = [];
      metadata.menu.categories.forEach(c => {
        c.items.forEach(i => {
          items.push({ amount: ethers.utils.parseEther(i.price) });
          idx++;
        })
      });
      const cid = await generateMetadataCID(metadata);
      const res = await contract.createMenu(cid, items);
      await res.wait();
      return metadata;
    },
  })
}

export const useCreateBillMutation = () => {
  const { data: signer } = useSigner();
  const { contract } = useWallet();
  return useMutation({
    mutationFn: async (metadata: BillMetadata) => {
      if (!contract?.provider || !signer) {
        throw new Error('Wallet not connected');
      }
      const cid = await generateMetadataCID(metadata);
      const res = await contract.createBill(cid);
      await res.wait();
      return metadata;
    },
  })
}

export const useCreateOrderMutation = () => {
  const { data: signer } = useSigner();
  const { contract } = useWallet();
  return useMutation({
    mutationFn: async ({ orderItems }: { orderItems: OrderItem[] }) => {
      if (!contract?.provider || !signer) {
        throw new Error('Wallet not connected');
      }
      const res = await contract.createOrder(orderItems.map(oi => ({ menuItemIdx: oi.item.id, quantity: oi.quantity })))
      await res.wait();
      return true;
    },
  });
}

export const usePayBill = () => {
  const { data: signer } = useSigner();
  const { contract } = useWallet();
  return useMutation({
    mutationFn: async ({ billId, value }: { billId: BigNumberish, value: BigNumber }) => {
      if (!contract?.provider || !signer) {
        throw new Error('Wallet not connected');
      }
      const res = await contract.payBill(billId, {
        value,
      })
      await res.wait();
      return true;
    },
  });
}

export const useWithdraw = () => {
  const { data: signer } = useSigner();
  const { contract } = useWallet();
  return useMutation({
    mutationFn: async ({ toAddress, value }: { toAddress: string, value: BigNumber }) => {
      if (!contract?.provider || !signer) {
        throw new Error('Wallet not connected');
      }
      const res = await contract.withdraw(toAddress, value);
      await res.wait();
      return true;
    },
  });
}

export const useAddMember = () => {
  const { data: signer } = useSigner();
  const { contract } = useWallet();
  return useMutation({
    mutationFn: async ({ toAddress, role }: { toAddress: string, role: BigNumber }) => {
      if (!contract?.provider || !signer) {
        throw new Error('Wallet not connected');
      }
      const res = await contract.addMember(toAddress, role);
      await res.wait();
      return true;
    },
  });
}

export const useRemoveMember = () => {
  const { data: signer } = useSigner();
  const { contract } = useWallet();
  return useMutation({
    mutationFn: async ({ toAddress }: { toAddress: string }) => {
      if (!contract?.provider || !signer) {
        throw new Error('Wallet not connected');
      }
      const res = await contract.removeMember(toAddress);
      await res.wait();
      return true;
    },
  });
}

export const useSetConfigInfo = () => {
  const { data: signer } = useSigner();
  const { contract } = useWallet();
  return useMutation({
    mutationFn: async (configMetadata: ConfigMetadata) => {
      if (!contract?.provider || !signer) {
        throw new Error('Wallet not connected');
      }
      const cid = await generateMetadataCID(configMetadata);
      const res = await contract.setConfigCID(cid);
      await res.wait();
      return true;
    },
  });
}

export const useAssignWaiterToBill = () => {
  const { data: signer } = useSigner();
  const { contract } = useWallet();
  return useMutation({
    mutationFn: async ({ billId, waiterAddress }: { billId: BigNumber, waiterAddress: string }) => {
      if (!contract?.provider || !signer) {
        throw new Error('Wallet not connected');
      }
      const res = await contract.assignWaiterToBill(billId, waiterAddress);
      await res.wait();
      return true;
    },
  });
}

