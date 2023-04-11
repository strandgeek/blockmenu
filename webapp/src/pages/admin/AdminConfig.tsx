import React, { FC, useEffect } from "react";
import { AdminMainLayout } from "../../layouts/AdminMainLayout";
import { PaintBrushIcon } from "@heroicons/react/24/outline";
import { SketchPicker } from 'react-color';
import { ColorPicker } from "../../components/ColorPicker";
import { ImageUpload } from "../../components/admin/ImageUpload";
import { useSetConfigInfo } from "../../client/mutations";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import classNames from "classnames";
import { useConfigMetadataInfo } from "../../client/queries";

export interface AdminConfigProps {}


interface FormData {
  restaurantName?: string;
  logoCID?: string;
  primaryColor?: string;
}

export const AdminConfig: FC<AdminConfigProps> = (props) => {
  const { data } = useConfigMetadataInfo();
  const { register, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm<FormData>({
    defaultValues: {
      ...data?.metadata,
    },
    
  });
  useEffect(() => {
    reset(data?.metadata);
  }, [data?.metadata]);
  const { mutateAsync, isLoading } = useSetConfigInfo();
  const onSubmit = async (data: FormData) => {
    await mutateAsync(data);
    toast('Configuration Updated!');
  }
  const values = getValues();
  return (
    <AdminMainLayout title="Configuration">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-8">
          <div className="shadow">
            <div className="p-4 b-4 flex items-center text-gray-500 border-b">
              <PaintBrushIcon className="h-6 w-6" />
              <h2 className="text-xl ml-2">Appearance</h2>
            </div>
            <div className="p-8">
              <div className="form-control w-full max-w-xl">
                <label className="label">
                  <span className="label-text">Restaurant Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xl"
                  {...register('restaurantName', { required: true })}
                />
              </div>
              <div className="form-control w-full max-w-xl mt-8">
                <label className="label">
                  <span className="label-text">Logo</span>
                </label>
                <ImageUpload imgPreviewClasses="h-16 border p-2" onChange={cid => setValue('logoCID', cid)} cid={values.logoCID} />
              </div>
              <div className="form-control w-full max-w-xl mt-8">
                <label className="label">
                  <span className="label-text">Primary Color</span>
                </label>
                <ColorPicker onChange={(color) => setValue('primaryColor', color)} color={values.primaryColor || '#FFF'} />
              </div>
            </div>
          </div>
          <div className="text-right mt-4">
            <button className={classNames("btn btn-primary", { loading: isLoading })} type="submit">Save</button>
          </div>
        </div>
      </form>
    </AdminMainLayout>
  );
};
