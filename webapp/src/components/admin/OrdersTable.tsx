import classNames from "classnames";
import { FC, useState } from "react";
import { useAllOrdersInfos, useBillMetadata } from "../../client/queries";
import { getBillShortDescription } from "../../utils/bill";
import { AddressInfo } from "../AddressInfo";
import { RelativeDate } from "../RelativeDate";
import { OrderinfoResponse } from "../../types/BlockMenuContract";
import { ethers } from "ethersv5";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { ClockIcon, DocumentCheckIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const OrderRow: FC<{ order: OrderinfoResponse }> = ({ order }) => {
  const [openModal, setOpenModal] = useState(false);
  const {
    data: billMetadata,
    error,
    isLoading,
  } = useBillMetadata({
    billMetadataCid: order?.bill?.metadataCID,
  });
  if (!order || !order.bill) {
    return null;
  }
  const { bill } = order;
  return (
    <>
      <OrderDetailsModal
        order={order}
        open={openModal}
        setOpen={setOpenModal}
      />
      <tr>
        <td className="px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium text-gray-900">
          <div className="flex items-center space-x-3 lg:pl-2">
            <div
              className={classNames("flex-shrink-0 w-2.5 h-2.5 rounded-full")}
              aria-hidden="true"
            />
            <span className="truncate hover:text-gray-600">
              <span>
                Order #{order?.id?.toString()}{" "}
                <span className="text-gray-500 font-normal">
                  {" "}
                  {getBillShortDescription(billMetadata)}
                </span>
              </span>
            </span>
            <a
              className="text-blue-600"
              role="button"
              onClick={() => setOpenModal(true)}
            >
              View
            </a>
          </div>
        </td>
        <td className="px-6 py-3 text-sm text-gray-500 font-medium">
          <div className="space-x-2 w-32 text-center ">
            #{order?.bill?.id.toString()}
          </div>
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
          <RelativeDate value={order?.createdAt} />
        </td>
      </tr>
    </>
  );
};

export interface OrdersTableProps {}

export const OrdersTable: FC<OrdersTableProps> = (props) => {
  const { data: orders, isLoading } = useAllOrdersInfos({});
  if (!orders) {
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
                  <span className="lg:pl-2">Order</span>
                </th>
                <th className="text-center px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill ID
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
                {/* <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" /> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order) => (
                <OrderRow order={order as any} key={order?.id?.toString()} />
              ))}
            </tbody>
          </table>
          {!isLoading && orders.length === 0 ? (
            <div className="w-full">
              <div className="py-24 w-128 mx-auto text-center">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No bills created yet
                </h3>
                <Link className="btn btn-outline mt-8" to="/admin/qr-code">
                  <QrCodeIcon className="h-6 w-6 mr-2" />
                  Share the QR Code
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
