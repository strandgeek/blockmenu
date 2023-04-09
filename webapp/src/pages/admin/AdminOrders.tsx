import React, { FC } from 'react'
import { AdminMainLayout } from '../../layouts/AdminMainLayout'
import { OrdersTable } from '../../components/admin/OrdersTable'

export interface AdminOrdersProps {
  
}

export const AdminOrders: FC<AdminOrdersProps> = (props) => {
  return (
    <AdminMainLayout title="Orders">
      <OrdersTable />
    </AdminMainLayout>
  )
}
