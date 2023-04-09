import React, { FC, useMemo } from 'react';
import { useBillMetadata, useMetadataInfo } from '../../client/queries';
import { allItemsToMap } from '../../lib/metadata';
import { AddressInfo } from '../AddressInfo';
import { Modal, ModalProps } from '../Modal';
import { RelativeDate } from '../RelativeDate';
import { OrderInfosResponse, OrderinfoResponse } from '../../types/BlockMenuContract';

export interface OrderDetailsModalProps extends Omit<ModalProps, 'children'> {
    order: Partial<OrderinfoResponse>
}

export const OrderDetailsModal: FC<OrderDetailsModalProps> = ({ order, ...props }) => {
    const { data } = useMetadataInfo();
    const itemsMap = useMemo(() => allItemsToMap(data?.metadata), [data]);
    const { data: billMetadata } = useBillMetadata({
        billMetadataCid: order?.bill?.metadataCID
    });
    const actions = (
        <div className="flex justify-between w-full items-center">
            <div className="text-gray-500">
                Created <RelativeDate value={order?.createdAt} />
            </div>
            <button role="button" type="button" onClick={() => props.setOpen(false)} className="btn btn-outline">
                Close
            </button>
        </div>
    );
    return (
        <Modal {...props} title={`Order #${order.id} details`} actions={actions}>
            <div>
                <div>
                    <div className="font-bold">Bill Info</div>
                    <div>ID: #{order?.bill?.id?.toString()}</div>
                    <div>Customer: {billMetadata?.name}</div>
                    <div className="mt-1">
                        Reference Code:{' '}
                        {billMetadata?.refCode ? (
                            billMetadata?.refCode
                        ) : (
                            <span className="text-gray-500">(Not defined)</span>
                        )}
                    </div>
                    <div className="mt-4">
                        <div className="font-bold">
                          Waiter:
                        </div>
                        {order?.bill?.waiter ? (
                            <AddressInfo address={order?.bill?.waiter?.toString()} short />
                        ) : (
                            <span className="text-gray-500">(Unassigned)</span>
                        )}
                    </div>
                </div>
                <div className="font-bold mt-4">Orders:</div>
                <div>
                    {order && order.lines && order.lines.map((oi) => (
                        <div>
                            {oi.quantity.toNumber()}x {itemsMap[oi.menuItemIdx.toNumber()]?.name}
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
