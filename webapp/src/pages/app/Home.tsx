import classNames from 'classnames';
import React, { FC, useState } from 'react';
import { useCurrentBill, useMetadataInfo } from '../../client/queries';
import { AppMainLayout } from '../../layouts/AppMainLayout';
import { Category, MenuItem } from '../../lib/metadata';
import { getCidUrl } from '../../lib/web3storage';
import { useNavigate } from 'react-router-dom';
import { ItemView } from '../../components/app/ItemView';
import { ConnectWalletButton } from '../../components/ConnectWalletButton';

export interface AppHomePageProps {}

export const AppHomePage: FC<AppHomePageProps> = (props) => {
    const navigate = useNavigate();
    const { data: bill } = useCurrentBill();
    const [currentViewingItem, setCurrentViweingItem] = useState<MenuItem | null>(null);
    const { data: metadataInfo } = useMetadataInfo();
    const categories: Category[] = metadataInfo?.metadata?.menu?.categories || [];
    const onMenuItemClick = (item: MenuItem) => {
      if (!bill) {
        navigate('/app/start');
        return;
      }
      setCurrentViweingItem(item);
    }
    return (
        <AppMainLayout>
            <ConnectWalletButton />
            <ItemView item={currentViewingItem} onClose={() => setCurrentViweingItem(null)} />
            <ul className="menu bg-base-100 w-full p-2 rounded-box">
                {categories.map((category: Category) => (
                    <>
                        <li className="menu-title text-left mt-8">
                            <span className="text-lg">{category.name}</span>
                        </li>
                        {category.items.map((item: MenuItem) => (
                            <li
                                className="block"
                                onClick={() => onMenuItemClick(item)}
                            >
                                <div className="grid grid-cols-6 gap-4">
                                    <div className="col-span-5">
                                        <div className="flex">
                                            <div className="mr-2">
                                                <figure className="h-16 w-24 overflow-hidden shrink-0">
                                                    <img src={getCidUrl(item.imageCID || '')} className="object-cover w-full h-full" />
                                                </figure>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm">{item.name}</div>
                                                <div className="text-gray-500 text-xs line-clamp-2">{item.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <div className="flex items-center">
                                            <div className="text-sm">{item.price}</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </>
                ))}
            </ul>
        </AppMainLayout>
    );
};
