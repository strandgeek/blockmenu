import React, { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, ModalProps } from "../Modal";
import { ImageUpload } from "./ImageUpload";
import { BTTCIcon } from "../BTTCIcon";
import { AmountInput } from "../AmountInput";

interface FormData {
  imageCID?: string;
  name: string;
  description?: string;
  price: string;
}

export interface AddEditMenuItemModalProps
  extends Omit<ModalProps, "children"> {
  currentCategoryIdx?: number;
  currentItemIdx?: number;
  onSave: (data: FormData) => void;
  defaultValues?: FormData;
}

export const AddEditMenuItemModal: FC<AddEditMenuItemModalProps> = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: props.defaultValues,
  });
  useEffect(() => {
    reset(props.defaultValues);
  }, [props.defaultValues]);
  const onSubmit = (data: FormData) => {
    props.onSave(data);
    reset();
    props.setOpen(false);
  };
  const isEditing = !!props.defaultValues;
  const actions = (
    <>
      <button
        type="button"
        className="btn btn-ghost mr-4"
        onClick={() => props.setOpen(false)}
      >
        Cancel
      </button>
      <button className="btn btn-primary">
        {isEditing ? "Update" : "Add"} Item
      </button>
    </>
  );
  return (
    <Modal
      {...props}
      title="Menu Item"
      actions={actions}
      onFormSubmit={handleSubmit(onSubmit)}
    >
      <div className="form-control w-full mt-2">
        <label className="label">
          <span className="label-text">Image</span>
        </label>
        <ImageUpload onChange={(cid) => setValue("imageCID", cid)} />
      </div>
      <div className="form-control w-full mt-2">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          {...register("name", { required: true })}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
      </div>
      <div className="form-control w-full mt-2">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          {...register("description", { required: false })}
          placeholder="Type here"
          className="textarea textarea-bordered h-24"
        ></textarea>
      </div>
      <div className="form-control w-full mt-2">
        <label className="label">
          <span className="label-text">Price (BTTC)</span>
        </label>
        <AmountInput {...register("price", { required: true })} />
      </div>
    </Modal>
  );
};
