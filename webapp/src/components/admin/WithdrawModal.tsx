import classNames from "classnames";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
// import { useWithdrawMutation } from '../../client/mutations';
import { Modal, ModalProps } from "../Modal";
import { AmountInput } from "../AmountInput";
import { useWithdraw } from "../../client/mutations";
import { ethers } from "ethersv5";
import { useAccount } from "wagmi";

interface FormData {
  address: string;
  amount: string;
}

export interface WithdrawModalProps extends Omit<ModalProps, "children"> {
  onFinish: () => void;
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ ...props }) => {
  const { address } = useAccount();
  const { mutateAsync, isLoading } = useWithdraw();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({});

  const onSubmit = async (form: FormData) => {
    try {
      await mutateAsync({
        toAddress: form.address,
        value: ethers.utils.parseEther(form.amount),
      });
      toast("Withdraw successfully");
      props.setOpen(false);
      props.onFinish();
    } catch (error) {}
  };
  const actions = (
    <>
      <button
        role="button"
        type="button"
        onClick={() => props.setOpen(false)}
        className="btn btn-outline"
      >
        Cancel
      </button>
      <button
        type="submit"
        className={classNames("btn btn-primary ml-2", { loading: isLoading })}
      >
        {isLoading ? "Withdrawing..." : "Withdraw"}
      </button>
    </>
  );
  return (
    <Modal
      {...props}
      title="Withdraw"
      actions={actions}
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">To Address</span>
            <span className="label-text">
              <button className="text-sm text-primary" onClick={() => setValue('address', address || '')}>
                My Address
              </button>
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("address", { required: true })}
          />
        </div>
        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Amount (BTTC)</span>
          </label>
          <AmountInput {...register("amount", { required: true })} />
        </div>
      </div>
    </Modal>
  );
};
