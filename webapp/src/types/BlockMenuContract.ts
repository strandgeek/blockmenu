import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  BlockMenuContract,
  BlockMenuContractMethodNames,
  BlockMenuContractEventsContext,
  BlockMenuContractEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type BlockMenuContractEvents = 'OwnershipTransferred';
export interface BlockMenuContractEventsContext {
  OwnershipTransferred(...parameters: any): EventFilter;
}
export type BlockMenuContractMethodNames =
  | 'new'
  | 'ADMIN_ROLE'
  | 'WAITER_ROLE'
  | 'addMember'
  | 'assignWaiterToBill'
  | 'createBill'
  | 'createMenu'
  | 'createOrder'
  | 'getAccountCurrentBill'
  | 'getBillOrdersInfo'
  | 'getBillTotalAmount'
  | 'getLatestOrderInfos'
  | 'getMembers'
  | 'getMenu'
  | 'getOrderInfo'
  | 'hasRole'
  | 'owner'
  | 'payBill'
  | 'removeMember'
  | 'renounceOwnership'
  | 'transferOwnership';
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface CreateMenuRequest {
  amount: BigNumberish;
}
export interface CreateOrderRequest {
  menuItemIdx: BigNumberish;
  quantity: BigNumberish;
}
export interface BillResponse {
  id: BigNumber;
  0: BigNumber;
  owner: string;
  1: string;
  waiter: string;
  2: string;
  menuVersion: BigNumber;
  3: BigNumber;
  metadataCID: string;
  4: string;
  status: number;
  5: number;
  ordersTotal: BigNumber;
  6: BigNumber;
  createdAt: BigNumber;
  7: BigNumber;
  exists: boolean;
  8: boolean;
}
export interface LinesResponse {
  menuItemIdx: BigNumber;
  0: LinesResponse[];
  quantity: BigNumber;
  1: LinesResponse[];
}
export interface OrderinfoResponse {
  id: BigNumber;
  0: BigNumber;
  bill: BillResponse;
  1: BillResponse;
  lines: LinesResponse[];
  2: LinesResponse[];
}
export interface MemberinfoResponse {
  account: string;
  0: string;
  role: BigNumber;
  1: BigNumber;
}
export interface MenuResponse {
  metadataCID: string;
  0: string;
  itemsTotal: BigNumber;
  1: BigNumber;
  exists: boolean;
  2: boolean;
}
export interface MenuitemResponse {
  amount: BigNumber;
  0: BigNumber;
}
export interface GetMenuResponse {
  result0: MenuResponse;
  0: MenuResponse;
  result1: MenuitemResponse[];
  1: MenuitemResponse[];
  length: 2;
}
export interface BlockMenuContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  ADMIN_ROLE(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  WAITER_ROLE(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param account Type: address, Indexed: false
   * @param role Type: uint256, Indexed: false
   */
  addMember(
    account: string,
    role: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param billId Type: uint256, Indexed: false
   * @param waiter Type: address, Indexed: false
   */
  assignWaiterToBill(
    billId: BigNumberish,
    waiter: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param metadataCID Type: string, Indexed: false
   */
  createBill(
    metadataCID: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param metadataCID Type: string, Indexed: false
   * @param items Type: tuple[], Indexed: false
   */
  createMenu(
    metadataCID: string,
    items: CreateMenuRequest[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param orderLines Type: tuple[], Indexed: false
   */
  createOrder(
    orderLines: CreateOrderRequest[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   */
  getAccountCurrentBill(
    account: string,
    overrides?: ContractCallOverrides
  ): Promise<BillResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param billId Type: uint256, Indexed: false
   */
  getBillOrdersInfo(
    billId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<OrderinfoResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param billId Type: uint256, Indexed: false
   */
  getBillTotalAmount(
    billId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getLatestOrderInfos(
    overrides?: ContractCallOverrides
  ): Promise<OrderinfoResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMembers(overrides?: ContractCallOverrides): Promise<MemberinfoResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getMenu(overrides?: ContractCallOverrides): Promise<GetMenuResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param orderId Type: uint256, Indexed: false
   */
  getOrderInfo(
    orderId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<OrderinfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   * @param role Type: uint256, Indexed: false
   */
  hasRole(
    account: string,
    role: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param billId Type: uint256, Indexed: false
   */
  payBill(
    billId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param account Type: address, Indexed: false
   */
  removeMember(
    account: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
