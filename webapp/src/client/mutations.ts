import { useMutation } from "react-query";
import { useTron } from "../hooks/useTron";
import { Metadata, generateMetadataCID } from "../lib/metadata";
import { waitFor } from "../utils/waitFor";
import { waitForTxn } from "../utils/waitForTxn";
import { getMetadataInfo } from "./queries";

export const setMetadataInfo = (c?: any) => async (metadata: Metadata): Promise<{ cid: string | null, metadata: Metadata }> => {
  const cid = await generateMetadataCID(metadata)
  const { tronWeb } = window;
  // Configure Menu for On-Chain data
  let idx = 0;
  const items: number[][] = [];
  metadata.menu.categories.forEach(c => {
    c.items.forEach(i => {
      items.push([tronWeb.toSun(i.price)]);
      idx++;
    })
  });

  await c.createMenu(cid, items).send();
  await waitFor(() => getMetadataInfo(c)(), (m) => m.cid === cid);
  return {
    cid,
    metadata,
  }
}


export const useSetMetadataInfoMutation = () => {
  const { contract } = useTron()
  return useMutation({
    mutationFn: (metadata: Metadata) => {
      return setMetadataInfo(contract)(metadata)
    },
  })
}
