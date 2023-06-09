import React, { FC, useEffect, useState } from 'react'
import { getCidUrl, web3Storage } from '../../lib/web3storage';

export interface ImageUploadProps {
  cid?: string;
  onChange: (cid: string) => void;
  imgPreviewClasses?: string;
}

export const ImageUpload: FC<ImageUploadProps> = ({ cid, onChange, imgPreviewClasses = 'w-full h-72 object-cover' }) => {
  const [imageCID, setImageCID] = useState<string>();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const { files } = e.target;
    if (!files?.length) {
      return;
    }
    const [f] = files;
    const cid = await web3Storage.put([f], { wrapWithDirectory: false });
    setImageCID(cid);
    onChange(cid);
  }
  useEffect(() => {
    setImageCID(cid);
  }, [cid]);
  return (
    <div>
      {imageCID && (
        <div className="mb-4">
          <img src={getCidUrl(imageCID)} className={imgPreviewClasses} />
        </div>
      )}
      <input className="file-input" type="file" onChange={onFileChange}/>
    </div>
  )
}
