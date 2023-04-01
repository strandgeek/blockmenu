import { Web3Storage } from "web3.storage";

export const web3Storage = new Web3Storage({ token: import.meta.env.VITE_WEB3_STORAGE_TOKEN })

export const getCidUrl = (cid: string) => `https://w3s.link/ipfs/${cid}`;
