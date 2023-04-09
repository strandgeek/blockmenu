import { BillMetadata } from "../lib/metadata";

export const getBillShortDescription = (billMetadata?: BillMetadata | null): string => {
  if (!billMetadata) {
    return '';
  }
  const { name, refCode } = billMetadata;
  if (!refCode) {
    return `from ${name}`;
  }
  return `from ${name} (${refCode})`;
}
