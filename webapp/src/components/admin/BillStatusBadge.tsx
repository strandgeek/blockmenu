import classNames from 'classnames'
import React, { FC, useMemo } from 'react'

export interface BillStatusBadgeProps {
  status: number;
}

export const BillStatusBadge: FC<BillStatusBadgeProps> = ({ status }) => {
  const statusInfo = useMemo(() => {
    return {
      0: {
        label: 'Open',
        class: 'badge-warning',
      },
      1: {
        label: 'Paid',
        class: 'badge-success',
      },
      2: {
        label: 'Canceled',
        class: 'badge-error',
      },
    }[status] || {
      label: 'Unknown',
      class: '',
    }
  }, [status]);
  return (
    <div className={classNames('badge text-white', statusInfo.class)}>{statusInfo.label}</div>
  )
}
