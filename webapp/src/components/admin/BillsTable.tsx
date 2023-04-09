import classNames from "classnames";
import { FC, useMemo } from "react";
import {
  useAllBillsInfos,
  useBillMetadata,
  useMetadataInfo,
} from "../../client/queries";
import { getBillShortDescription } from "../../utils/bill";
import { AddressInfo } from "../AddressInfo";
import { RelativeDate } from "../RelativeDate";
import { BillinfoResponse } from "../../types/BlockMenuContract";
import { BigNumber, ethers } from "ethersv5";
import { BillStatusBadge } from "./BillStatusBadge";
import { allItemsToMap } from "../../lib/metadata";
import { Amount } from "../Amount";

const BillRow: FC<{ billInfo: BillinfoResponse }> = ({ billInfo }) => {
  const { data: billMetadata } = useBillMetadata({
    billMetadataCid: billInfo?.bill?.metadataCID,
  });
  if (!billInfo || !billInfo.bill) {
    return null;
  }
  const { bill } = billInfo;
  return (
    <>
      <tr>
        <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
          <div className="flex items-center space-x-3 lg:pl-2">
            <div
              className={classNames("flex-shrink-0 w-2.5 h-2.5 rounded-full")}
              aria-hidden="true"
            />
            <span className="truncate hover:text-gray-600">
              <span>
                Bill #{billInfo?.id?.toString()}{" "}
                <span className="text-gray-500 font-normal">
                  {" "}
                  {getBillShortDescription(billMetadata)}
                </span>
              </span>
            </span>
          </div>
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-medium">
          <BillStatusBadge status={bill.status} />
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-medium text-center">
          {bill?.ordersTotal.toNumber()}
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-medium text-center">
          <Amount value={billInfo?.totalAmount} />
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {bill?.owner ? (
                <AddressInfo address={bill.owner.toString()} short />
              ) : null}
            </div>
          </div>
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {bill?.waiter != ethers.constants.AddressZero ? (
                <AddressInfo address={bill?.waiter || ""} short />
              ) : (
                "(Unassigned)"
              )}
            </div>
          </div>
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
          <RelativeDate value={bill?.createdAt} />
        </td>
      </tr>
    </>
  );
};

export interface OrdersTableProps {}

export const BillsTable: FC<OrdersTableProps> = (props) => {
  const { data: billInfos } = useAllBillsInfos({});
  if (!billInfos) {
    return null;
  }
  return (
    <div>
      {/* TODO: Uncomment it on filter implementation */}
      {/* <div className="px-4 mt-6 sm:px-6 lg:px-8 mb-10 sm:mb-8">
                <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Filters</h2>
                <ul className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3"></ul>
            </div> */}
      <div>
        <div className="align-middle inline-block min-w-full border-b border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr className="border-t border-gray-200">
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="lg:pl-2">Bill</span>
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waiter/Waitress
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {billInfos.map((billInfo: any) => (
                <BillRow
                  billInfo={billInfo as any}
                  key={billInfo?.id?.toString()}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
