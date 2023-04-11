import classNames from "classnames";
import { FC } from "react";
import { toast } from "react-toastify";
import { useAssignWaiterToBill } from "../../client/mutations";
import { useBillMetadata } from "../../client/queries";
import { AddressInfo } from "../AddressInfo";
import { Modal, ModalProps } from "../Modal";
import { BillResponse } from "../../types/BlockMenuContract";
import { BigNumber, ethers } from "ethers";
import { useAccount } from "wagmi";

export interface AssignYourselfModalProps extends Omit<ModalProps, "children"> {
  bill: BillResponse & { id: BigNumber };
}

export const AssignYourselfModal: FC<AssignYourselfModalProps> = ({
  bill,
  ...props
}) => {
  const { address } = useAccount();
  const { mutateAsync, isLoading } = useAssignWaiterToBill();
  const { data: billMetadata } = useBillMetadata({
    billMetadataCid: bill?.metadataCID,
  });
  const onConfirm = async () => {
    try {
      await mutateAsync({
        billId: bill.id,
        waiterAddress: address!,
      });
      toast("Assigned to bill successfully");
      props.setOpen(false);
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
        onClick={onConfirm}
        role="button"
        type="button"
        className={classNames("btn btn-primary ml-2", { loading: isLoading })}
      >
        {isLoading ? "Assigning..." : "Confirm"}
      </button>
    </>
  );
  return (
    <Modal
      {...props}
      title={`Bill #${bill.id} - Assign Yourself`}
      actions={actions}
    >
      <div>
        <div>
          <div className="font-bold">Bill Info</div>
          <div>ID: #{bill.id.toString()}</div>
          <div>Customer: {billMetadata?.name}</div>
          <div className="mt-1">
            Reference Code:{" "}
            {billMetadata?.refCode ? (
              billMetadata?.refCode
            ) : (
              <span className="text-gray-500">(Not defined)</span>
            )}
          </div>
          <div className="mt-4">
            <div className="font-bold">Waiter:</div>
            {bill.waiter !== ethers.constants.AddressZero ? (
              <AddressInfo address={bill?.waiter} short />
            ) : (
              <span className="text-gray-500">(Unassigned)</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
