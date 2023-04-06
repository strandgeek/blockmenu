import { Metadata } from "../lib/metadata";
import ContractV1 from '../contracts/v1.json';
import { getCidUrl } from "../lib/web3storage";
import axios from "axios";

interface TxOptions {
  feeLimit: bigint;
  callValue: bigint;
  tokenValue: bigint;
  tokenId: bigint;
}

interface TxParameter {
  type: string;
  value: any;
}

interface TronWeb {
  contract: (abi: any[], address: string) => any;
  transactionBuilder: {
    triggerSmartContract: (
      contractAddress: string,
      functions: string,
      options: TxOptions,
      params: TxParameter,
      issuerAddress: string,
    ) => any;
  }
}

export interface Bill {
  id: bigint;
  owner: string;
  waiter: string;
  menuVersion: bigint;
  metadataCID: string;
  status: number;
  ordersTotal: number;
  createdAt: number;
  exists: boolean;
}

export interface OrderLine {
  menuItemIdx: number;
  quantity: number;
}

export interface OrdersInfo {
  id: bigint;
  bill: Bill;
  lines: OrderLine[];
}

export interface BlockMenuWrapper {
  getMetadataInfo: () => Promise<{ cid: string | null, metadata: Metadata }>;
  getAccountCurrentBill: (address: string) => Promise<Bill>;
  getBillOrdersInfo: (billId: bigint) => Promise<OrdersInfo[]>;
  getBillTotalAmount: (billId: bigint) => Promise<bigint>;
}

const EmptyMetadataInfo = {
  cid: null,
  metadata: {
    name: '',
    menu: {
      categories: [],
    }
  }
}

export const createBlockMenuTronWrapper = ({
  tronWeb,
  contractAddress
}: {
  tronWeb: TronWeb,
  contractAddress: string,
}): BlockMenuWrapper => {
  const contract = tronWeb.contract(ContractV1.abi, contractAddress);
  return {
    getMetadataInfo: async function (): Promise<{ cid: string | null, metadata: Metadata }> {
      const menuRes = await contract.getMenu().call();
      const [menu] = menuRes;
      const cid = menu.metadataCID;
      try {        
        const { data: metadata } = await axios.get<Metadata>(getCidUrl(cid));
        return {
          cid,
          metadata,
        }
      } catch (error) {
        return EmptyMetadataInfo;
      }
    },
    getAccountCurrentBill: async function(address: string): Promise<Bill> {
      return contract.getAccountCurrentBill(address).call();
    },
    getBillOrdersInfo: async function(billId: bigint): Promise<OrdersInfo[]> {
      return contract.getBillOrdersInfo(billId).call();
    },
    getBillTotalAmount: async function(billId: bigint): Promise<bigint> {
      return contract.getBillTotalAmount(billId).call();
    },
  }
}
