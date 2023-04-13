import classNames from "classnames";
import React, { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import { useConfigMetadataInfo } from "../client/queries";
import { getCidUrl } from "../lib/web3storage";
import { CustomStylesWrapper } from "../components/app/CustomStylesWrapper";

export interface AppMainLayoutProps {
  children: React.ReactNode;
}

export const AppMainLayout: FC<AppMainLayoutProps> = ({ children }) => {
  const { data: config } = useConfigMetadataInfo();
  const order = useOrder();
  const location = useLocation();
  const navigate = useNavigate();
  const getTabClassNames = (isActive: boolean) => {
    return classNames("tab tab-lg tab-lifted", { "tab-active": isActive });
  };
  const getTabItemProps = (pathName: string) => {
    return {
      className: getTabClassNames(location.pathname === pathName),
      onClick: () => navigate(pathName),
    };
  };
  const ordersCount = order.items.length;
  return (
    <CustomStylesWrapper primaryColor={config?.metadata.primaryColor}>
      <div className="w-full overflow-hidden">
        <div className="flex justify-center my-2">
          {config?.metadata.logoCID && (
            <img src={getCidUrl(config?.metadata.logoCID)} className="h-6" />
          )}
        </div>
        <div className="mt-8">
          <div className="tabs w-screen grid grid-cols-3">
            <a {...getTabItemProps("/app")}>Menu</a>
            <a {...getTabItemProps("/app/order")}>
              Order{" "}
              {ordersCount > 0 ? (
                <div className="badge badge-primary badge-sm ml-2">
                  {order.items.length}
                </div>
              ) : null}
            </a>
            <a {...getTabItemProps("/app/bill")}>Bill</a>
          </div>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </CustomStylesWrapper>
  );
};
