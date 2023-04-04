import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateBillMutation } from "../../client/mutations";
import { useMetadataInfo, useCurrentBill } from "../../client/queries";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTron } from "../../hooks/useTron";

export interface AppStartProps {}

export const AppStart: FC<AppStartProps> = (props) => {
  const navigate = useNavigate();
  const { address } = useTron();
//   const { data: metadataInfo } = useMetadataInfo();
  const { mutateAsync, isLoading } = useCreateBillMutation();
  const { data: bill, refetch: refetchBill } = useCurrentBill();
  const [name, setName] = useState("");
  const onStartClick = async () => {
    try {
      await mutateAsync({
        name,
      });
      navigate("/app");
    } catch (error: any) {
      toast(error.message);
    }
  };
  useEffect(() => {
    async function refetch() {
      const billRes = await refetchBill();
      if (billRes.data) {
        navigate("/app");
      }
    }
    refetch();
  }, []);
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
              <div>Before continue, connect your TRON wallet</div>
              <div className="flex items-center justify-center mt-8"></div>
              <div className="w-full flex items-center justify-center">
                TODO: Connect Wallet Button Here
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};
