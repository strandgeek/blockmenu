import React, { FC } from "react";
import { BTTCIcon } from "./BTTCIcon";

export interface AmountInputProps {}

export const AmountInput: FC<any>= React.forwardRef((props, ref) => {
  return (
    <div className="relative">
      <BTTCIcon className="h-4 w-4 absolute mt-4 ml-4" />
      <input
        ref={ref}
        {...props}
        type="text"
        className="input input-bordered w-full pl-10"
      />
    </div>
  );
});
