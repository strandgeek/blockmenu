import { InboxIcon, PlusIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../../client/mutations";
import { useOrder } from "../../hooks/useOrder";
import { AppMainLayout } from "../../layouts/AppMainLayout";
import { getCidUrl } from "../../lib/web3storage";
import { Amount } from "../../components/Amount";
import { ItemView } from "../../components/app/ItemView";
import { MenuItem, allItemsToMap } from "../../lib/metadata";
import { OrderItem } from "../../providers/OrderProvider";
import { useCurrentBill, useMetadataInfo } from "../../client/queries";
import { useAccount } from "wagmi";

export interface AppOrdersPageProps {}

export const AppOrdersPage: FC<AppOrdersPageProps> = (props) => {
  const order = useOrder();
  const [currentViewingItem, setCurrentViweingItem] = useState<MenuItem | null>(
    null
  );
  const { isConnected } = useAccount();
  const { isLoading, mutateAsync } = useCreateOrderMutation();
  const { data: metadataInfo } = useMetadataInfo();
  const { data: bill, isLoading: billIsLoading } = useCurrentBill();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isConnected) {
      navigate("/app/start");
    }
  }, [isConnected]);
  const onSubmit = async () => {
    try {
      await mutateAsync({
        orderItems: order.items,
      });
      toast("Order created");
      order.clear();
      navigate("/app");
    } catch (error: any) {}
  };
  const editOrder = (orderItem: OrderItem) => {
    const menuItemsFlatten = allItemsToMap(metadataInfo?.metadata);
    const menuItem = menuItemsFlatten[orderItem.item.id];
    setCurrentViweingItem(menuItem);
  };
  return (
    <AppMainLayout>
      <ItemView
        item={currentViewingItem}
        onClose={() => setCurrentViweingItem(null)}
        editMode
      />
      <div className="pb-16 mt-16">
        <ul className="menu bg-base-100 w-full p-2 rounded-box">
          {order.items.map((orderItem) => (
            <li className="block" onClick={() => editOrder(orderItem)}>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-5">
                  <div className="flex">
                    <div className="mr-2">
                      <figure className="h-16 w-24 overflow-hidden shrink-0">
                        <img
                          src={getCidUrl(orderItem.item.imageCID || "")}
                          className="object-cover w-full h-full"
                        />
                      </figure>
                    </div>
                    <div className="text-left">
                      <div className="text-sm">
                        {orderItem.quantity}x {orderItem.item.name}
                      </div>
                      <div className="text-gray-500 text-xs line-clamp-2">
                        {orderItem.item.description}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Amount value={orderItem.item.price} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        {order.items.length === 0 ? (
          <div className="text-center">
            <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No items added
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Go to menu and add items to your order
            </p>
          </div>
        ) : null}
      </div>
      <div className="p-4 fixed w-full bottom-0">
        {!billIsLoading && (!bill ||!bill.exists || bill && bill.status === 1 )? (
          <Link className="btn btn-primary btn-block" to="/app/start">
            Create Bill
          </Link>
        ) : (
          <>
            <button
              className={classNames("btn btn-primary btn-block", {
                loading: isLoading,
              })}
              disabled={order.items.length === 0}
              onClick={onSubmit}
            >
              {isLoading ? "Submitting..." : "Submit Order"}
            </button>
            <div className="text-gray-500 text-xs text-center mt-4">
              The kitchen will prepare your order only when it has been
              submitted.
            </div>
          </>
        )}
      </div>
    </AppMainLayout>
  );
};
