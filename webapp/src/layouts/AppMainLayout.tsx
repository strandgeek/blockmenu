import classNames from 'classnames';
import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';

export interface AppMainLayoutProps {
  children: React.ReactNode;
}

export const AppMainLayout: FC<AppMainLayoutProps> = ({ children }) => {
    const order = useOrder();
    const location = useLocation();
    const navigate = useNavigate();
    const getTabClassNames = (isActive: boolean) => {
        return classNames('tab tab-lg tab-lifted', { 'tab-active': isActive });
    };
    const getTabItemProps = (pathName: string) => {
        return {
            className: getTabClassNames(location.pathname === pathName),
            onClick: () => navigate(pathName),
        };
    };
    const ordersCount = order.items.length;
    return (
        <div className="w-full overflow-hidden">
            <div className="mt-8">
                <div className="tabs w-screen grid grid-cols-3">
                    <a {...getTabItemProps('/app')}>Menu</a>
                    <a {...getTabItemProps('/app/order')}>Order {ordersCount > 0 ? <div className="badge badge-primary badge-sm ml-2">{order.items.length}</div>: null}</a>
                    <a {...getTabItemProps('/app/bill')}>Bill</a>
                </div>
            </div>
            <div className="overflow-y-auto">
                {children}
            </div>
        </div>
    );
};
