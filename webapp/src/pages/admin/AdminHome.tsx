import React, { FC, useMemo } from "react";
import {
  useContractBalance,
  useMetadataInfo,
  useAllOrdersInfos,
  useAllBillsInfos,
} from "../../client/queries";
import { AdminMainLayout } from "../../layouts/AdminMainLayout";
import { ClockIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";
import { OrdersTable } from "../../components/admin/OrdersTable";
import { BigNumber, ethers } from "ethersv5";
import { BTTCIcon } from "../../components/BTTCIcon";

export interface AdminHomeProps {}

const getYesterday = () => {
  const ts = Math.round(new Date().getTime() / 1000);
  return ts - 24 * 3600;
};
export const AdminHome: FC<AdminHomeProps> = (props) => {
  const yesterday = useMemo(() => getYesterday(), []);
  const { data: contractBalance } = useContractBalance();
  const { data: orders } = useAllOrdersInfos({
    fromDate: yesterday,
  });
  const { data: bills } = useAllBillsInfos({
    fromDate: yesterday,
  });
  return (
    <AdminMainLayout title="Home">
      <div className="p-8">
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <BTTCIcon className="inline-block w-5 h-5" />
            </div>
            <div className="stat-title">Contract Balance</div>
            <div className="stat-value">
              {contractBalance
                ? ethers.utils.formatEther(BigNumber.from(contractBalance))
                : null}
            </div>
            <div className="stat-desc">Current</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-gray-500">
              <ClockIcon className="inline-block w-8 h-8 stroke-current" />
            </div>
            <div className="stat-title">Recent Orders</div>
            <div className="stat-value">{orders?.length}</div>
            <div className="stat-desc">Last 24h</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-gray-500">
              <DocumentCheckIcon className="inline-block w-8 h-8 stroke-current" />
            </div>
            <div className="stat-title">Recent Bills</div>
            <div className="stat-value">{bills?.length}</div>
            <div className="stat-desc">Last 24h</div>
          </div>
        </div>
      </div>

      <div>
        <OrdersTable />
      </div>
    </AdminMainLayout>
  );
};
