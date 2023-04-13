import React, { FC } from "react";
import { AdminMainLayout } from "../../layouts/AdminMainLayout";

export interface AdminPreviewProps {}

export const AdminPreview: FC<AdminPreviewProps> = (props) => {
  return (
    <AdminMainLayout title="Preview dApp">
      <div className="bg-gray-200 bg-opacity-60">
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="mockup-phone">
            <div className="camera"></div>
            <div className="display">
              <div className="artboard artboard-demo phone-1 pt-8">
                <div id="preview-wrap">
                  <iframe id="preview-frame" src="/app"  className="h-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </AdminMainLayout>
  );
};
