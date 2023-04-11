import { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateBillMutation } from "../../client/mutations";
import { useCurrentBill } from "../../client/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "../../components/ConnectWalletButton";
import { useSessionStorage } from "usehooks-ts";

export interface AppStartProps {}

export const AppStart: FC<AppStartProps> = (props) => {
  const [contractAddr, setContractAddr] = useSessionStorage('blockmenu-contract', '');
  const [refCode, setRefCode] = useSessionStorage('blockmenu-refcode', '');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { mutateAsync, isLoading } = useCreateBillMutation();
  const { data: bill, refetch: refetchBill } = useCurrentBill();
  const [name, setName] = useState("");
  useEffect(() => {
    const addr = searchParams.get('contract');
    if (addr) {
      setContractAddr(addr);
    }
    const refCode = searchParams.get('refCode');
    if (refCode) {
      setRefCode(refCode);
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
  }, []);
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
  return (
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
              <h2 className="mb-4 text-lg">Welcome</h2>
              <div>Before continue, connect your Metamask wallet</div>
              <div className="flex items-center justify-center mt-8"></div>
              <div className="w-full flex items-center justify-center">
                <ConnectWalletButton />
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};
