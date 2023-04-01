import { FC, Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export interface ModalProps {
    title?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void |  React.Dispatch<React.SetStateAction<boolean>>;
    onFormSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export const Modal: FC<ModalProps> = ({ title, actions, children, open, setOpen, onFormSubmit }) => {
    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div>
                                    {title ? (
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b">
                                            <div className="text-lg">{title}</div>
                                        </div>
                                    ) : null}
                                    <form onSubmit={onFormSubmit}>
                                        <div className="p-4">{children}</div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex xs:flex-row-reverse justify-end items-center">
                                            {actions ? actions : null}
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
