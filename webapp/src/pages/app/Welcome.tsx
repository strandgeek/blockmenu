import React, { FC } from 'react'
import { useConfigMetadataInfo } from '../../client/queries'
import { getCidUrl } from '../../lib/web3storage';
import { MetaMaskIcon } from '../../components/MetaMaskIcon';
import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export interface WelcomeProps {
  
}

export const Welcome: FC<WelcomeProps> = (props) => {
  const { data: config } = useConfigMetadataInfo();
  return (
    <div>
        <div className="flex justify-center my-8">
          {config?.metadata.logoCID && (
            <img src={getCidUrl(config?.metadata.logoCID)} className="h-8" />
          )}
        </div>
        <div className="text-center">
          <h1 className="text-xl mt-24 text-gray-500 max-w-xl">
            Welcome to {config?.metadata.restaurantName}!
          </h1>
          <div className="max-w-xs mx-auto mt-16 text-gray-600">
            <button className="btn btn-ghost w-full flex border border-gray-700 hover:border-gray-700">
              <MetaMaskIcon className="w-6 h-6 mr-2" />
              Connect MetaMask
            </button>
            <button className="btn btn-ghost w-full flex border border-gray-700 hover:border-gray-700">
              <DocumentTextIcon className="h-6 w-6" />
              Open the Menu
            </button>
          </div>
        </div>
    </div>
  )
}
