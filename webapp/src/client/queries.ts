import axios from "axios";
import { useQuery } from "react-query";
import { useTron } from "../hooks/useTron";
import { Metadata } from "../lib/metadata";
import { getCidUrl } from "../lib/web3storage";

const EmptyMetadataInfo = {
  cid: null,
  metadata: {
    name: '',
    menu: {
      categories: [],
    }
  }
}

export const getMetadataInfo = (c?: any) => async (): Promise<{ cid: string | null, metadata: Metadata }> => {
  try {
    const menuRes = await c.getMenu().call();

    const [menu, items] = menuRes;

    if (menu.metadataCID === '' || menu.itemsTotal.toNumber() === 0 || !menu.exists) {
      return EmptyMetadataInfo;
    }

    const cid = menu.metadataCID;
  
    // Fetch Metadata JSON on IPFS Gateway
    const { data: metadata } = await axios.get<Metadata>(getCidUrl(cid));
    return {
      cid,
      metadata,
    }
  } catch (error: any) {
    console.log(error);
    return EmptyMetadataInfo;
  }
}

export const useMetadataInfo = () => {
  const { contract } = useTron();
  return useQuery('metadata', getMetadataInfo(contract), { enabled: !!contract, staleTime: 10 * (60 * 1000) });
}
