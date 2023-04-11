import { FC, useMemo, useState } from "react";
import { AdminMainLayout } from "../../layouts/AdminMainLayout";
import QRCode from "react-qr-code";
import { useWallet } from "../../hooks/useWallet";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export interface QrCodeGeneratorProps {}

export const QrCodeGenerator: FC<QrCodeGeneratorProps> = (props) => {
  const { contract } = useWallet();
  const [refCode, setRefCode] = useState("");
  const url = useMemo(() => {
    if (!contract) {
      return "";
    }
    const baseUrl = import.meta.env.VITE_WEBAPP_BASE_URL || 'https://blockmenu.xyz';
    const dappUrl = new URL(`${baseUrl}/app/start`);
    dappUrl.searchParams.set("contract", contract!.address);
    if (refCode && refCode !== "") {
      dappUrl.searchParams.set("refCode", refCode);
    }
    return dappUrl.toString();
  }, [contract?.address, refCode]);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url || '');
    toast('Url Copied to Clipboard');
  }
  if (!contract?.address) {
    return null;
  }
  return (
    <AdminMainLayout title="QR Code Generator">
      <div className="w-full">
        <div className="p-8 flex justify-center">
          <div className="border p-8">
            <div className="">
              <div className="">
                <div className="form-control w-full max-w-[320px]">
                  <label className="label">
                    <span className="label-text">Reference Code</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 04"
                    className="input input-bordered w-full max-w-[320px]"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                  />
                </div>
                <div className="max-w-[320px] text-gray-500 mt-4">
                  Use this field to identify the origin of the bill. For example
                  the table number
                </div>
              </div>
              <div className="svg-container">
                <QRCode value={url} className="mt-8" size={320} />

                <div className="form-control">
                  <div className="input-group w-full mt-4">
                    <input
                      type="text"
                      value={url}
                      className="input input-bordered w-full"
                    />
                    <div className="tooltip tooltip-right" data-tip="Copy to Clipboard">
                      <button className="btn rounded-l-none btn-square btn-primary" onClick={() => copyToClipboard()}>
                        <ClipboardIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminMainLayout>
  );
};
