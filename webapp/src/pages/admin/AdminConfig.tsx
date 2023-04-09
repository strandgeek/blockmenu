import React, { FC } from "react";
import { AdminMainLayout } from "../../layouts/AdminMainLayout";
import { PaintBrushIcon } from "@heroicons/react/24/outline";
import { SketchPicker } from 'react-color';
import { ColorPicker } from "../../components/ColorPicker";
import { ImageUpload } from "../../components/admin/ImageUpload";

export interface AdminConfigProps {}

export const AdminConfig: FC<AdminConfigProps> = (props) => {
  return (
    <AdminMainLayout title="Configuration">
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
              />
            </div>
            <div className="form-control w-full max-w-xl mt-8">
              <label className="label">
                <span className="label-text">Logo</span>
              </label>
              <ImageUpload imgPreviewClasses="h-16 border p-2" onChange={function (cid: string): void {
                throw new Error("Function not implemented.");
              } } />
            </div>
            <div className="form-control w-full max-w-xl mt-8">
              <label className="label">
                <span className="label-text">Primary Color</span>
              </label>
              <ColorPicker />
            </div>
          </div>
        </div>
      </div>
    </AdminMainLayout>
  );
};
