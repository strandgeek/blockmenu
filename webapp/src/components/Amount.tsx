import React, { FC } from 'react';
import { BTTCIcon } from './BTTCIcon';
import { BigNumber, ethers } from 'ethersv5';

export interface AmountProps {
    value: number | bigint | BigNumber | string;
}

export const Amount: FC<AmountProps> = ({ value }) => {
    return (
        <div className="flex items-center">
            <div className="mr-1">
                <BTTCIcon className="w-4 h-4 mr-0.5" />
            </div>
            <div className="text-sm">{typeof value === 'string' ? value : ethers.utils.formatEther(value || 0)}</div>
        </div>
    );
};
