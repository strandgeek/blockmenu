import { TrashIcon, UsersIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { FC, useState } from "react";
import { AddressInfo } from "../../components/AddressInfo";
import { AddUserRoleModal } from "../../components/admin/AddUserRoleModal";
import { RemoveRoleModal } from "../../components/admin/RemoveRoleModal";
import { AdminMainLayout } from "../../layouts/AdminMainLayout";
import { useMembers } from "../../client/queries";

export interface AdminUsersProps {}

export const AdminUsers: FC<AdminUsersProps> = (props) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const { data: members, isLoading, refetch } = useMembers();
  const actions = (
    <div className="mt-4 flex sm:mt-0 sm:ml-4">
      <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
        <PlusIcon className="h-5 w-5 mr-1" />
        Add User
      </button>
    </div>
  );
  return (
    <AdminMainLayout title="Users & Roles" actions={actions}>
      <AddUserRoleModal
        open={showAddModal}
        setOpen={setShowAddModal}
        onFinish={refetch}
      />
      <RemoveRoleModal
        address={addressToDelete || ""}
        open={!!addressToDelete}
        setOpen={() => setAddressToDelete(null)}
        onFinish={refetch}
      />
      <div className="w-full">
        <div className="align-middle inline-block min-w-full border-b border-gray-200">
          {members?.length ? (
            <>
              <table className="table w-full">
                <thead>
                  <tr className="border-t border-gray-200">
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="lg:pl-2">User</span>
                    </th>
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="pr-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {members!.map((u) => (
                      <tr>
                        <td>
                          <AddressInfo address={u.account} />
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            {u.role.toNumber() === 0x01 ? (
                              <span className="badge bg-blue-500 border-none">
                                Admin
                              </span>
                            ) : (
                              <span className="badge bg-orange-400 border-none">
                                Waiter
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-error text-white btn-xs"
                            onClick={() => setAddressToDelete(u.account)}
                            // onClick={onRemoveItem(categoryIdx, itemIdx)}
                          >
                            <TrashIcon className="w-4 h-4 mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="flex items-center justify-center w-full text-center">
              <div className="py-24 w-128">
                <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No admin or waiter added yet
                </h3>
                <button
                  className="btn btn-primary mt-8"
                  onClick={() => setShowAddModal(true)}
                >
                  Add User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminMainLayout>
  );
};
