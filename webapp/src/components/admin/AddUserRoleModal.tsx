import classNames from "classnames";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddMember } from "../../client/mutations";
import { Modal, ModalProps } from "../Modal";
import { BigNumber } from "ethers";

const ROLES = {
  admin: 0x01,
  waiter: 0x02,
};

interface FormData {
  address: string;
  role: "admin" | "waiter";
}

export interface AddUserRoleModalProps extends Omit<ModalProps, "children"> {
  onFinish: () => void;
}

export const AddUserRoleModal: FC<AddUserRoleModalProps> = ({ ...props }) => {
  const { mutateAsync, isLoading } = useAddMember();

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
        role: BigNumber.from(ROLES[form.role]),
      });
      toast("User Role added successfully");
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
        {isLoading ? "Adding User..." : "Add User"}
      </button>
    </>
  );
  return (
    <Modal
      {...props}
      title="Add User"
      actions={actions}
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">BTTC Address</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("address", { required: true })}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Role</span>
          </label>
          <select
            className="select select-bordered w-full"
            {...register("role", { required: true })}
          >
            <option disabled selected>
              Select the role
            </option>
            <option value="admin">Admin</option>
            <option value="waiter">Waiter</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};
