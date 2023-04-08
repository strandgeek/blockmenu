import { TronLinkAdapter, WalletConnectAdapter, LedgerAdapter } from '@tronweb3/tronwallet-adapters';
import { BillMetadata, Metadata, generateBillMetadataCID, generateMetadataCID } from "../lib/metadata";
import ContractV1 from '../contracts/v1.json';
import { getCidUrl } from "../lib/web3storage";
import axios from "axios";
import { waitFor } from '../utils/waitFor';
import { OrderItem } from '../providers/OrderProvider';

type Adapter = TronLinkAdapter | WalletConnectAdapter | LedgerAdapter

interface TxOptions {
  feeLimit?: bigint;
  callValue?: bigint;
  tokenValue?: bigint;
  tokenId?: bigint;
  funcABIV2?: any;
  parametersV2?: any;
}

interface TxParameter {
  type: string;
  value: any;
}

interface TronWeb {
  utils: {
    abi: any; ethersUtils: any; 
};
  trx: any;
  toUtf8(message: any): any;
  contract: (abi: any[], address: string) => any;
  toSun: (value: string) => bigint;
  ethersUtils: any;
  transactionBuilder: {
    triggerSmartContract: (
      contractAddress: string,
      functions: string,
      options: TxOptions,
      params: TxParameter[],
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
  // Getters
  getMetadataInfo: () => Promise<{ cid: string | null, metadata: Metadata }>;
  getAccountCurrentBill: (address: string) => Promise<Bill>;
  getBillOrdersInfo: (billId: bigint) => Promise<OrdersInfo[]>;
  getBillTotalAmount: (billId: bigint) => Promise<bigint>;
  // Setters
  setMetadataInfo: (metadata: Metadata) => Promise<{ cid: string | null, metadata: Metadata }>;
  createBill: (metadata: BillMetadata) => Promise<boolean>;
  createOrder: (orderItems: OrderItem[]) => Promise<boolean>;
  payBill: (billId: bigint, value: bigint) => Promise<boolean>;
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

const getFunctionSelector = (tronWeb: TronWeb, abi: any) => {
  const { ethersUtils } = tronWeb.utils;
  abi.stateMutability = abi.stateMutability ? abi.stateMutability.toLowerCase() : 'nonpayable';
  abi.type = abi.type ? abi.type.toLowerCase() : '';
  if (abi.type === 'fallback' || abi.type === 'receive') return '0x';
  let iface = new ethersUtils.Interface([abi]);
  console.log(iface);
  if (abi.type === 'event') {
    return iface.getEvent(abi.name).format(ethersUtils.FormatTypes.sighash);
  }
  return iface.getFunction(abi.name).format(ethersUtils.FormatTypes.sighash)
}

export const createBlockMenuTronWrapper = ({
  tronWeb,
  adapter,
  contractAddress
}: {
  tronWeb: TronWeb,
  adapter?: Adapter,
  contractAddress: string,
}): BlockMenuWrapper => {
  const contract = tronWeb.contract(ContractV1.abi, contractAddress);
  const buildTriggerSmartContractTxn = (methodName: string, parametersV2: any[], options: TxOptions = {}): any => {
    if (!adapter || !adapter.address) {
      throw new Error('Wallet not connected');
    }
    const fnAbi = ContractV1.abi.find(abi => abi.name === methodName);
    console.log(tronWeb);
    const selector = getFunctionSelector(tronWeb, fnAbi);
    console.log(selector);
    return tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress,
      selector,
      {
        funcABIV2: fnAbi,
        parametersV2,
        ...options,
      },
      [],
      adapter.address,
    );
  };
  const sendRawTransaction = async (txnSigned: any) => {
    const broadcast = await tronWeb.trx.sendRawTransaction(txnSigned);

    if (broadcast.code) {
      const err = {
        error: broadcast.code,
        message: broadcast.code
      };
      if (broadcast.message)
        err.message = tronWeb.toUtf8(broadcast.message);
      throw err
    }
  }
  const requireAdapter = () => {
    if (!adapter || !adapter.address) {
      throw new Error('Wallet not connected');
    }
  }
  return {
    getMetadataInfo: async function (): Promise<{ cid: string | null, metadata: Metadata }> {
      try {
        const menuRes = await contract.getMenu().call();
        const [menu] = menuRes;
        const cid = menu.metadataCID;
        const { data: metadata } = await axios.get<Metadata>(getCidUrl(cid));
        return {
          cid,
          metadata,
        }
      } catch (error) {
        console.log(error);
        return EmptyMetadataInfo;
      }
    },
    getAccountCurrentBill: async function (address: string): Promise<Bill> {
      return contract.getAccountCurrentBill(address).call();
    },
    getBillOrdersInfo: async function (billId: bigint): Promise<OrdersInfo[]> {
      return contract.getBillOrdersInfo(billId).call();
    },
    getBillTotalAmount: async function (billId: bigint): Promise<bigint> {
      return contract.getBillTotalAmount(billId).call();
    },
    setMetadataInfo: async function (metadata: Metadata): Promise<{ cid: string | null, metadata: Metadata }> {
      try {        
        requireAdapter();
        const cid = await generateMetadataCID(metadata)
        // Configure Menu for On-Chain data
        let idx = 0;
        const items: bigint[][] = [];
        metadata.menu.categories.forEach(c => {
          c.items.forEach(i => {
            items.push([tronWeb.toSun(i.price)]);
            idx++;
          })
        });
        const params: any = [
          cid,
          items,
        ];
        const { transaction } = await buildTriggerSmartContractTxn('createMenu', params);
        const txnSigned = await adapter?.signTransaction(transaction);
        await sendRawTransaction(txnSigned);
        await waitFor(() => this.getMetadataInfo(), (m) => m.cid === cid);
        return {
          cid,
          metadata,
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    createBill: async function (metadata: BillMetadata): Promise<boolean> {
      try {        
        requireAdapter();
        const getCurrentBill = () => this.getAccountCurrentBill(adapter!.address!)
        const currentBill = await getCurrentBill();
        const cid = await generateBillMetadataCID(metadata)
        const params: any = [
          cid,
        ];
        const { transaction } = await buildTriggerSmartContractTxn('createBill', params);
        const txnSigned = await adapter?.signTransaction(transaction);
        await sendRawTransaction(txnSigned);
        await waitFor(() => getCurrentBill(), (bill) => bill.id != currentBill.id);
        return true
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    createOrder: async function (orderItems: OrderItem[]): Promise<boolean> {
      try {        
        requireAdapter();
        const getOrdersCount = async () => {
          try {
            const bill = await this.getAccountCurrentBill(adapter!.address!);
            return bill.ordersTotal;
          } catch (error) {
            console.log(error);
          };
          return 0;
        };
        const currentOrdersCount = await getOrdersCount();
        const ordersList: number[][] = [];
        orderItems.forEach(oi => {
          ordersList.push([oi.item.id, oi.quantity]);
        });
        const params = [
          ordersList,
        ];
        const { transaction } = await buildTriggerSmartContractTxn('createOrder', params);
        const txnSigned = await adapter?.signTransaction(transaction);
        await sendRawTransaction(txnSigned);
        await waitFor(() => getOrdersCount(), (count) => count > currentOrdersCount);
        return true
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    payBill: async function (value: bigint): Promise<boolean> {
      try {        
        requireAdapter();
        const getCurrentBill = () => this.getAccountCurrentBill(adapter!.address!);
        const currentBill = await getCurrentBill();
        const params = [
          currentBill.id,
        ];
        const options: TxOptions = {
          callValue: value,
        }
        const { transaction } = await buildTriggerSmartContractTxn('payBill', params, options);
        const txnSigned = await adapter?.signTransaction(transaction);
        await sendRawTransaction(txnSigned);
        await waitFor(() => getCurrentBill(), (bill) => bill.status === 1);
        return true
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  }
}
