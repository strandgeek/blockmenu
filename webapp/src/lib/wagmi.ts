import { w3mConnectors } from "@web3modal/ethereum";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const donau = {
  id: 1029,
  name: "BitTorrent Chain Donau",
  network: "donau",
  nativeCurrency: {
    name: "BTT",
    symbol: "BTT",
    decimals: 18,
  },

  rpcUrls: {
    default: {
      http: ["https://pre-rpc.bt.io"],
    },
    public: {
      http: ["https://pre-rpc.bt.io"],
    },
  },

  blockExplorers: {
    default: {
      name: "Testcan BitTorrent Chain",
      url: "https://testscan.bittorrentchain.io",
    },
  },
};

export const chains = [donau];

export const metaMaskConnector = new MetaMaskConnector({
  chains
});


export const connectors = w3mConnectors({ projectId: import.meta.env.VITE_CONNECT_WALLET_PROJECT_ID, version: 1, chains });
