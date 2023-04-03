import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/solid";
import React, { FC, useEffect, useState } from "react";
import { useMetadataInfo } from "../../client/queries";
import { useSetMetadataInfoMutation } from '../../client/mutations';
import {
  AddEditMenuItemModal,
  AddEditMenuItemModalProps,
} from "../../components/admin/AddEditMenuItemModal";
import { AdminMainLayout } from "../../layouts/AdminMainLayout";
import {
  Category,
  MenuItem,
  Metadata,
} from "../../lib/metadata";
import { getCidUrl } from "../../lib/web3storage";
import classNames from "classnames";

export interface AdminMenuProps {}

export const AdminMenu: FC<AdminMenuProps> = () => {
  const { data: metadataInfoData } = useMetadataInfo();
  const mutation = useSetMetadataInfoMutation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategoryIdx, setCurrentCategoryIdx] = useState<number>();
  const [currentItemIdx, setCurrentItemIdx] = useState<number>();
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  useEffect(() => {
    if (!addEditModalOpen) {
      setCurrentCategoryIdx(undefined);
      setCurrentItemIdx(undefined);
    }
  }, [addEditModalOpen]);
  useEffect(() => {
    setCategories(metadataInfoData?.metadata.menu.categories || []);
  }, [metadataInfoData]);
  const onCategoryIdxChange =
    (categoryIdx: number): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      categories[categoryIdx].name = e.target.value;
      setCategories([...categories]);
    };
  const onAddCategoryClick = () => {
    setCategories([...categories, { name: "", items: [] }]);
  };
  const onAddCategoryItemClick = (categoryIdx: number) => () => {
    setCurrentCategoryIdx(categoryIdx);
    setAddEditModalOpen(true);
  };
  const onAddEditMenuItemModalSave: AddEditMenuItemModalProps["onSave"] = (
    data
  ) => {
    if (currentCategoryIdx === undefined) {
      return;
    }
    const item: MenuItem = {
      id: -1, // MenuItem id is based on idx and it's filled before save
      name: data.name,
      price: data.price,
      imageCID: data.imageCID,
      description: data.description,
    };
    const c = [...categories];
    if (currentItemIdx === undefined) {
      c[currentCategoryIdx] = {
        ...c[currentCategoryIdx],
        items: [...c[currentCategoryIdx].items, item],
      };
    } else {
      const items = [...c[currentCategoryIdx].items];
      items[currentItemIdx] = item;
      c[currentCategoryIdx] = {
        ...c[currentCategoryIdx],
        items,
      };
    }
    setCategories(c);
  };
  const onRemoveItem = (categoryIdx: number, itemIdx: number) => () => {
    const c = [...categories];
    c[categoryIdx] = {
      ...c[categoryIdx],
      items: [...c[categoryIdx].items.filter((item, idx) => idx !== itemIdx)],
    };
    setCategories(c);
  };
  const onEditItem = (categoryIdx: number, itemIdx: number) => () => {
    if (categoryIdx == undefined || itemIdx == undefined) {
      return;
    }
    setCurrentCategoryIdx(categoryIdx);
    setCurrentItemIdx(itemIdx);
    setAddEditModalOpen(true);
  };
  const onSaveMenuClick = async () => {
    // Set the Item ID properly
    let itemIdx = 0;
    categories.forEach(category => {
      category.items.forEach(item => {
        item.id = itemIdx;
        itemIdx++;
      });
    })
    // TODO: Update current smart contract metadata
    const metadata: Metadata = {
      name: "Custom Restaurant Name",
      // ...currentMetadata, // TODO: fetch current smart contract metadata
      menu: {
        categories,
      },
    };
    const res = await mutation.mutateAsync(metadata)
    console.log(res);
    // const res = await mutation.mutateAsync(metadata);
    // console.log({ res });
  };
  return (
    <AdminMainLayout title="Menu">
      <div className="py-4 px-6">
        {addEditModalOpen && (
          <AddEditMenuItemModal
            open={addEditModalOpen}
            setOpen={setAddEditModalOpen}
            onSave={onAddEditMenuItemModalSave}
            defaultValues={
              currentItemIdx !== undefined && currentCategoryIdx !== undefined
                ? categories[currentCategoryIdx].items[currentItemIdx]
                : undefined
            }
          />
        )}
        {categories.map((category, categoryIdx) => (
          <div className="py-8">
            <div className="border">
              <div className="p-4">
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Category Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="eg: Soups"
                    className="input input-bordered w-full max-w-xs"
                    onChange={onCategoryIdxChange(categoryIdx)}
                    value={categories[categoryIdx].name}
                  />
                </div>
              </div>
              <div className="border-t">
                <div className="overflow-x-auto w-full">
                  <table className="table w-full">
                    {/* head */}
                    <thead>
                      <tr>
                        <th />
                        <th>Name</th>
                        <th>Price</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item, itemIdx) => (
                        <tr>
                          <th>
                            <Bars3Icon className="h-4 w-4 ml-4" />
                          </th>
                          <td>
                            <div className="flex items-center space-x-3">
                              {item.imageCID ? (
                                <div className="avatar">
                                  <div className="mask mask-squircle w-12 h-12">
                                    <img src={getCidUrl(item.imageCID)} />
                                  </div>
                                </div>
                              ) : null}
                              <div>
                                <div className="font-bold">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td>{item.price}</td>
                          <th>
                            <button
                              className="btn btn-error btn-ghost btn-xs mr-4"
                              onClick={onEditItem(categoryIdx, itemIdx)}
                            >
                              <PencilIcon className="w-4 h-4 mr-1" /> Edit
                            </button>
                            <button
                              className="btn btn-error text-white btn-xs"
                              onClick={onRemoveItem(categoryIdx, itemIdx)}
                            >
                              <TrashIcon className="w-4 h-4 mr-1" /> Delete
                            </button>
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t">
                  <div className="p-4">
                    <button
                      className="btn btn-ghost"
                      onClick={onAddCategoryItemClick(categoryIdx)}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-between">
          <button className="btn btn-ghost" onClick={onAddCategoryClick}>
            Add Category
          </button>
        </div>

        <div className="flex justify-end mt-8 pt-8 border-t">
          <button className={classNames("btn btn-primary", { loading: mutation.isLoading })} onClick={onSaveMenuClick}>
            Save Menu
          </button>
        </div>
      </div>
    </AdminMainLayout>
  );
};
