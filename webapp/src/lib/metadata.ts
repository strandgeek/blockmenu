import { web3Storage } from "./web3storage";

export type MenuItem = {
  id: number;
  imageCID?: string;
  name: string;
  description?: string;
  price: string;
};

export type Category = {
  name: string;
  items: MenuItem[];
};

export interface Metadata {
  name: string;
  menu: {
    categories: Category[]
  }
}
export interface BillMetadata {
  name?: string;
  refCode?: string;
}

export const generateMetadataCID = (metadata: Metadata) => {
  const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  const file = new File([blob], 'metadata.json');
  return web3Storage.put([file], { wrapWithDirectory: false });
};

export const allItemsToMap = (metadata?: Metadata) => {
  if (!metadata) {
    return {};
  }
  const flattenItems: { [id: number]: MenuItem } = {};
  for (let c of metadata.menu.categories) {
    for (let i of c.items) {
      flattenItems[i.id] = i;
    }
  }
  return flattenItems;
}

export const generateBillMetadataCID = (billMetadata: BillMetadata) => {
  const blob = new Blob([JSON.stringify(billMetadata)], { type: 'application/json' })
  const file = new File([blob], 'metadata.json');
  return web3Storage.put([file], { wrapWithDirectory: false });
}
