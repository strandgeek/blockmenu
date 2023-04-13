import {
  ClockIcon,
  ReceiptPercentIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, InboxIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePayBill } from "../../client/mutations";
import {
  useBillTotalAmount,
  useCurrentBill,
  useMetadataInfo,
  useOrdersInfos,
} from "../../client/queries";
import { SuccessTick } from "../../components/SuccessTick";
import { AppMainLayout } from "../../layouts/AppMainLayout";
import { allItemsToMap } from "../../lib/metadata";
import { BigNumber } from "ethers";
import { Amount } from "../../components/Amount";
import { useAccount } from "wagmi";

export interface AppBillPageProps {}

export const AppBillPage: FC<AppBillPageProps> = (props) => {
  const { data: metadataInfo } = useMetadataInfo();
  const { data: bill, isLoading: billIsLoading } = useCurrentBill();
  const { data: billTotal } = useBillTotalAmount({ billId: bill?.id });
  const { data: orders } = useOrdersInfos({ billId: bill?.id });
  const [billPaid, setBillPaid] = useState(false);
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const itemsMap = useMemo(
    () => allItemsToMap(metadataInfo?.metadata),
    [metadataInfo]
  );
  const [tipPercent, setTipPercent] = useState<number>();
  const { mutateAsync, isLoading } = usePayBill();
  useEffect(() => {
    if (!isConnected) {
      navigate("/app/start");
    }
  }, [isConnected]);
  useEffect(() => {
    if (!billIsLoading && !bill) {
      navigate("/app/start");
    }
  }, [billIsLoading]);
  const totalWithTips = useMemo(() => {
    if (!billTotal) {
      return 0;
    }
    if (!tipPercent) {
      return billTotal;
    }
    return billTotal?.mul(tipPercent).div(100).add(billTotal);
  }, [billTotal, tipPercent]);
  const hasWaiterAssigned =
    bill?.waiter &&
    bill.waiter !== "0x0000000000000000000000000000000000000000";
  const onSubmit = async () => {
    if (!bill || !totalWithTips) {
      return;
    }
    await mutateAsync({
      billId: bill.id,
      value: totalWithTips,
    });
    setBillPaid(true);
  };
  const renderLineItem = (item: any) => {
    const quantity = item?.quantity?.toNumber();
    const id = item?.menuItemIdx?.toNumber();
    const info = itemsMap[id];
    return (
      <tr>
        <th>{quantity}x</th>
        <td>{info?.name}</td>
        <td>{info?.price ? info?.price : null}</td>
      </tr>
    );
  };
  const isPaid = bill && bill.status === 1;
  if (!bill) {
    return null;
  }
  return (
    <AppMainLayout>
      <div className="overflow-hidden">
        {billPaid && (
          <div className="w-screen h-screen fixed bg-white top-0 left-0 z-50 transition-all">
            <div className="h-full w-full flex justify-center items-center">
              <div className="text-center">
                <SuccessTick />
                <div className="mt-4 text-3xl text-gray-500">Bill Paid</div>
                <Link to="/app" className="mt-8 btn btn-outline">
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="pb-[400px]">
          {bill ? (
            <>
              <div className="p-4">
                <div className="border-b pb-2 mb-2">
                  <h1 className="text-2xl">Bill #{bill?.id?.toNumber()}</h1>
                </div>

                {(orders || []).map((order: any) => (
                  <div className="mt-4" key={order.id?.toNumber()}>
                    <h2 className="text-md font-bold mb-2 text-gray-500">
                      Order #{order.id?.toNumber()}
                    </h2>
                    <table className="table table-compact w-full border">
                      <thead>
                        <tr>
                          <th>Qtd.</th>
                          <th>Item</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>{order.lines?.map(renderLineItem)}</tbody>
                    </table>
                  </div>
                ))}

                {orders && orders.length === 0 ? (
                  <div className="w-full">
                    <div className="py-24 w-128 mx-auto text-center">
                      <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No orders created yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Submit orders to your bill
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="text-center mt-24">
              <ReceiptPercentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No active bill
              </h3>
              <Link to="/app/get-started" className="btn btn-primary mt-8">
                Get Started
              </Link>
            </div>
          )}
        </div>
        <div className="p-4 fixed w-full bottom-0 border z-30 bg-white shadow-black shadow-2xl">
          {hasWaiterAssigned ? (
            <div>
              <div>
                <div className="text-gray-600 mb-4">Select a tip:</div>
                <div className="tabs tabs-boxed w-full grid grid-cols-5">
                  {[0, 10, 15, 18, 20].map((percent) => (
                    <a
                      className={classNames("tab", {
                        "tab-active": percent === tipPercent,
                      })}
                      key={percent}
                      onClick={() => setTipPercent(percent)}
                    >
                      {percent}%
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          <div className="mt-4 mb-4">
            <div className="flex items-center justify-end">
              <span className="font-bold mr-2">TOTAL:</span>
              <Amount value={totalWithTips} />
            </div>
          </div>
          {!isPaid ? (
            <>
              <button
                className={classNames("btn btn-primary btn-block", {
                  loading: isLoading,
                })}
                disabled={billTotal === BigNumber.from(0)}
                onClick={onSubmit}
              >
                {isLoading ? "Paying bill..." : "Pay Bill"}
              </button>
              {hasWaiterAssigned && (
                <div className="text-gray-500 text-xs text-center mt-4">
                  Tips are automatically transferred to the waiter/waitress
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-full flex items-center justify-center border-y my-4 py-8 pb-6">
                <div className="text-green-600 flex items-center text-2xl">
                  <CheckCircleIcon className="h-8 w-8 mr-1" />
                  Bill Paid
                </div>
              </div>
              <Link className="btn btn-primary btn-block" to="/app/start">
                Create Another Bill
              </Link>
            </>
          )}
        </div>
      </div>
    </AppMainLayout>
  );
};
