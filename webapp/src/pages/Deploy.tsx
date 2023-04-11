import classNames from "classnames";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useStep } from "usehooks-ts";
import blockMenuSrc from "../assets/logo.svg";
import { ConnectWalletButton } from "../components/ConnectWalletButton";
import ContractV1 from "../contracts/v1.json";
import { confettiAnimate } from "../utils/confettiAnimate";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";

export interface DeployProps {}

export const Deploy: FC<DeployProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const { data: signer } = useSigner();
  const { address, isConnected } = useAccount()
  const [currentStep, helpers] = useStep(3);
  const [templateType, setTemplateType] = useState<"sample" | "empty">(
    "sample"
  );
  const [deployedAddress, setDeployedAddress] = useState("");

  const deployContract = async () => {
    if (!signer) {
      alert('No Signer!');
      return;
    }
    setLoading(true);
    const factory = new ethers.ContractFactory(ContractV1.abi, ContractV1.bytecode, signer);
    const deployParams = templateType === 'empty' ? ['', []] : [
      'bafkreihh4r7zdnnarpw4ehiy4gy5vwgff2uyfpxi6zio74grndbwakqum4',
      ['0.05', '0.08', '0.09', '0.09', '0.02', '0.04'].map(val => ({ amount: ethers.utils.parseEther(val) })),
      '',
    ];
    const contract = await factory.deploy(...deployParams);
    // Wait for 1 contract confirmation
    await contract.deployTransaction.wait(1);
    confettiAnimate();
    setDeployedAddress(contract.address);
    helpers.goToNextStep();
    setLoading(false);
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
                <ConnectWalletButton />
              </div>
            </div>
            <div className="w-full p-4 border-t flex justify-end">
              <button
                disabled={!address}
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
                disabled={!address}
                className="btn btn-ghost"
                onClick={() => helpers.goToPrevStep()}
              >
                Back
              </button>
              <button
                disabled={!address}
                className={classNames("btn btn-primary", {
                  loading,
                })}
                onClick={() => deployContract()}
              >
                {loading ? 'Confirming...' : 'Deploy Contract'}
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
