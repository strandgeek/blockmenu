import classNames from 'classnames';
import { FC } from 'react';
import { toast } from 'react-toastify';
import { useRemoveMember } from '../../client/mutations';
import { AddressInfo } from '../AddressInfo';
import { Modal, ModalProps } from '../Modal';

export interface RemoveRoleModalProps extends Omit<ModalProps, 'children'> {
    address: string;
    onFinish: () => void;
}

export const RemoveRoleModal: FC<RemoveRoleModalProps> = ({ address, ...props }) => {
    const { mutateAsync, isLoading } = useRemoveMember();
    const onConfirm = async () => {
        try {
            await mutateAsync({
                toAddress: address,
            });
            toast('User Role removed successfully');
            props.setOpen(false);
            props.onFinish();
        } catch (error) {}
    };
    const actions = (
        <>
            <button role="button" type="button" onClick={() => props.setOpen(false)} className="btn btn-outline">
                Cancel
            </button>
            <button
                onClick={onConfirm}
                role="button"
                type="button"
                className={classNames('btn ml-2', { loading: isLoading })}
            >
                {isLoading ? 'Removing Role...' : 'Confirm'}
            </button>
        </>
    );
    return (
        <Modal {...props} title="Remove User Role" actions={actions}>
            <div>
                <div>
                    <div className="font-bold">Remove Role for:</div>
                    <AddressInfo address={address} short />
                </div>
            </div>
        </Modal>
    );
};
