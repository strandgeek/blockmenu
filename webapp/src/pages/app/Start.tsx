import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateBillMutation } from "../../client/mutations";
import { useConfigMetadataInfo, useCurrentBill } from "../../client/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "../../components/ConnectWalletButton";
import { useSessionStorage } from "usehooks-ts";
import { useWeb3Modal } from "@web3modal/react";
import { getCidUrl } from "../../lib/web3storage";
import { CustomStylesWrapper } from "../../components/app/CustomStylesWrapper";

export interface AppStartProps {}

export const AppStart: FC<AppStartProps> = (props) => {
  const [contractAddr, setContractAddr] = useSessionStorage(
    "blockmenu-contract",
    ""
  );
  const [refCode, setRefCode] = useSessionStorage("blockmenu-refcode", "");
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { mutateAsync, isLoading } = useCreateBillMutation();
  const { data: bill, refetch: refetchBill } = useCurrentBill();
  const [name, setName] = useState("");
  const { data: config, isLoading: isLoadingConfig } = useConfigMetadataInfo();
  const connect = () => {
    if (!isConnected) {
      open();
    }
  };
  useEffect(() => {
    const addr = searchParams.get("contract");
    if (addr) {
      setContractAddr(addr);
    }
    const refCode = searchParams.get("refCode");
    if (refCode) {
      setRefCode(refCode);
    }
    if (searchParams.get("autoConnect")) {
      connect();
    }
  }, [searchParams]);
  useEffect(() => {
    async function refetch() {
      const bill = await refetchBill();
      if (bill.data && bill.data.status === 0) {
        navigate("/app");
      }
    }
    refetch();
  }, [bill]);
  const onStartClick = async () => {
    try {
      await mutateAsync({
        name,
        refCode,
      });
      navigate("/app");
    } catch (error: any) {
      toast(error.message);
    }
  };
  if (!config) {
    return null
  }
  return (
    <CustomStylesWrapper primaryColor={config?.metadata.primaryColor}>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-full">
          <>
            {address ? (
              <div className="w-full p-16">
                {!isLoading ? (
                  <>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">
                          What is your name / nickname?
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-primary btn-block mt-4"
                      onClick={onStartClick}
                    >
                      Start
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full text-center">
                <div className="w-full text-center flex items-center justify-center mb-8">
                  {config?.metadata.logoCID && (
                    <img
                      src={getCidUrl(config?.metadata.logoCID)}
                      className="h-6"
                    />
                  )}
                </div>
                <h2 className="mb-4 text-2xl">Welcome</h2>
                <div>Before continue, connect your Metamask wallet</div>
                <div className="flex items-center justify-center mt-8"></div>
                <div className="w-full flex items-center justify-center">
                  <div className="w-full p-8">
                    <button className="btn btn-primary btn-block" onClick={() => open()}>
                      Connect Wallet
                    </button>
                    <Link to="/app" className="btn btn-outline w-full mt-4">
                      Open Menu
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </CustomStylesWrapper>
  );
};
