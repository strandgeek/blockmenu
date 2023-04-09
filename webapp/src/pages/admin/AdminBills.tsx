import React, { FC } from 'react'
import { AdminMainLayout } from '../../layouts/AdminMainLayout'
import { BillsTable } from '../../components/admin/BillsTable'

export interface AdminBillsProps {
  
}

export const AdminBills: FC<AdminBillsProps> = (props) => {
  return (
    <AdminMainLayout title="Bills">
      <BillsTable />
    </AdminMainLayout>
  )
}
