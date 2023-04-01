import { waitFor } from "./waitFor";

export const waitForTxn = (txId: string) => waitFor(
  () => window.tronWeb.trx.getTransaction(txId),
  (res: any) => !!res.txID
);
