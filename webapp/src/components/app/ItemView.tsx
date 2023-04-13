import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useOrder } from '../../hooks/useOrder';
import { MenuItem } from '../../lib/metadata';
import { getCidUrl } from '../../lib/web3storage';
import { Amount } from '../Amount';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAccount } from 'wagmi';
import { Link } from 'react-router-dom';

export interface ItemViewProps {
    item: MenuItem | null;
    onClose: () => void;
    editMode: boolean;
}

export const ItemView: FC<ItemViewProps> = ({ item, editMode = false, ...props }) => {
    const order = useOrder();
    const [quantity, setQuantity] = useState(1);
    const { isConnected } = useAccount();
    const open = !!item;
    useEffect(() => {
        if (open && item) {
            const itemOrder = order.items.find(io => io.item.id === item.id);
            if (itemOrder) {
                setQuantity(itemOrder.quantity);
            }
        }
    }, [open]);


    const onClose = () => {
        setQuantity(0);
        props.onClose();
    }

    const onAddClick = () => {
        const val = quantity < 10 ? quantity + 1 : 10;
        setQuantity(val);
    };

    const onSubtractClick = () => {
        const val = quantity > 0 ? quantity - 1 : 0;
        setQuantity(val);
    };

    const onAddToOrderClick = () => {
        if (!item) {
            return;
        }
        order.setOrderItem({
            item,
            quantity,
        });
        if (!editMode) {
            toast(`${quantity}x ${item.name} added to order`, { autoClose: 800 });
        }
        onClose();
    }
    return (
        <div>
            <div
                className={classNames(
                    'bg-opacity-50 bg-black fixed w-screen h-screen top-0 z-30 transition duration-300 ease-in-out overflow-hidden',
                    { invisible: !open }
                )}
                onClick={() => onClose()}
            />
            <div
                className={classNames('bg-white fixed bottom-0 z-40 w-full max-h-screen max-w-screen  overflow-y-auto transition duration-300 ease-in-out', {
                    'translate-y-full': !open,
                })}
            >
                {item && (
                    <div>
                        <div className="p-4 flex justify-between items-center">
                            <h2 className="text-gray-700 text-lg">{item.name}</h2>
                            <div>
                                <button className="btn btn-ghost" onClick={() => onClose()}>
                                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <img className="w-full h-64 object-cover" src={getCidUrl(item.imageCID!)} />
                        <div className="p-4">
                            <div className="mt-4">
                                <Amount value={item.price} />
                            </div>
                            <div className="mt-4">
                                <div className="text-sm text-gray-500">Description:</div>
                                {item.description}
                            </div>
                        </div>
                        <div className="p-4">
                            { isConnected ? (
                                <div className="grid grid-cols-2">
                                <div className="form-control">
                                    <div className="input-group">
                                        <button className="btn btn-outline" onClick={onSubtractClick}>
                                            <div>
                                                <MinusIcon className="w-5 h-5" />
                                            </div>
                                        </button>
                                        <input
                                            type="text"
                                            className="input input-bordered text-center w-full"
                                            value={quantity}
                                            readOnly
                                        />
                                        <button className="btn btn-outline">
                                            <div>
                                                <PlusIcon className="w-5 h-5" onClick={onAddClick} />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <button className="btn btn-primary ml-4" disabled={quantity <= 0} onClick={onAddToOrderClick}>
                                    {editMode ? 'Update': 'Add to Order'}
                                </button>
                            </div>
                            ): (
                                <Link className="btn btn-primary btn-block" to="/app/start?autoConnect=true">
                                    Connect Wallet
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
