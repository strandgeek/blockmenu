import React, { FC } from 'react'
import TimeAgo from 'javascript-time-ago'

// English.
import en from 'javascript-time-ago/locale/en'
import { BigNumberish } from 'ethers'

TimeAgo.addDefaultLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo('en-US')

export interface RelativeDateProps {
  value?: BigNumberish;
}

export const RelativeDate: FC<RelativeDateProps> = ({ value }) => {
  if (!value) {
    return null;
  }
  return (
    <>
      {timeAgo.format(Number(value)*1000)}
    </>
  )
}
