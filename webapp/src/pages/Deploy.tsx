import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStep } from "usehooks-ts";
import blockMenuSrc from "../assets/logo.svg";
import { ConnectTronWalletButton } from "../components/ConnectTronWalletButton";
import { useTron } from "../hooks/useTron";
import ContractV1 from "../contracts/v1.json";
import { toast } from "react-toastify";
import { waitFor } from "../utils/waitFor";
import { waitForTxn } from "../utils/waitForTxn";
import { confettiAnimate } from "../utils/confettiAnimate";

export interface DeployProps {}

export const Deploy: FC<DeployProps> = (props) => {
  const { address } = useTron();
  const [currentStep, helpers] = useStep(3);
  const [templateType, setTemplateType] = useState<"sample" | "empty">(
    "sample"
  );
  const [deployedAddress, setDeployedAddress] = useState("");
  const deployContract = async () => {
    const { tronWeb } = window;
    const transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi: ContractV1.abi,
        bytecode: ContractV1.bytecode,
        feeLimit: 1e10,
        callValue: 0,
        userFeePercentage: 30,
        originEnergyLimit: 1e7,
      },
      window.tronWeb.defaultAddress.hex
    );

    try {
      const signedTransaction = await tronWeb.trx.sign(transaction);
      const res = await tronWeb.trx.sendRawTransaction(signedTransaction);
      if (res?.code === 'BANDWITH_ERROR') {
        toast.error('Insufficient TRX Balance to deploy smart contract');
        return;
      }
      const address = tronWeb.address.fromHex(res.transaction.contract_address);
      await waitForTxn(res.txid);
      setDeployedAddress(address);
      confettiAnimate();
      helpers.goToNextStep();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl">
        <div className="w-full flex justify-center text-center">
          <img src={blockMenuSrc} className="h-8" />
        </div>
        <div className="w-full bg-white border shadow-md rounded-lg mt-8">
          <div className="w-full p-8 mt-8 border-b">
            <ul className="steps w-full">
              <li
                className={classNames("step", {
                  "step-primary": currentStep >= 1,
                })}
              >
                Connect Wallet
              </li>
              <li
                className={classNames("step", {
                  "step-primary": currentStep >= 2,
                })}
              >
                Deploy Contract
              </li>
              <li
                className={classNames("step", {
                  "step-primary": currentStep === 3,
                })}
              >
                Finished
              </li>
            </ul>
          </div>
          <div className={classNames({ hidden: currentStep !== 1 })}>
            <div className="w-full p-8">
              <div className="flex items-center justify-center py-4">
                <ConnectTronWalletButton />
              </div>
            </div>
            <div className="w-full p-4 border-t flex justify-end">
              <button
                disabled={address === ""}
                className="btn btn-primary"
                onClick={() => helpers.goToNextStep()}
              >
                Next
              </button>
            </div>
          </div>
          <div className={classNames({ hidden: currentStep !== 2 })}>
            <div className="w-full p-8">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">BlockMenu Version</span>
                </label>
                <select className="select select-bordered">
                  <option selected>BETA (HackaTRON Season 4)</option>
                </select>
              </div>
              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text">Template</span>
                </label>
                <select
                  className="select select-bordered"
                  onChange={(e) =>
                    setTemplateType(e.target.value as "sample" | "empty")
                  }
                >
                  <option value="sample" selected>
                    Sample Restaurant Data
                  </option>
                  <option value="empty">Empty</option>
                </select>
              </div>
            </div>
            <div className="w-full p-4 border-t flex justify-between">
              <button
                disabled={address === ""}
                className="btn btn-ghost"
                onClick={() => helpers.goToPrevStep()}
              >
                Back
              </button>
              <button
                disabled={address === ""}
                className="btn btn-primary"
                onClick={() => deployContract()}
              >
                Deploy Contract
              </button>
            </div>
          </div>
          <div className={classNames({ hidden: currentStep !== 3 })}>
            <div className="w-full p-8">
              <h2 className="text-center font-bold">
                Congratulations! Your contract is deployed!
              </h2>
              <div>
                <div className="form-control">
                  <div className="my-8 text-center">
                    Save below your contract address:
                  </div>
                  <input
                    type="text"
                    value={deployedAddress}
                    readOnly
                    className="input input-bordered text-center"
                  />
                </div>
              </div>
            </div>
            <div className="w-full p-4 border-t flex justify-between">
              <Link
                to={`/admin?contract=${deployedAddress}`}
                className="btn btn-primary btn-block"
              >
                Go to BlockMenu Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
