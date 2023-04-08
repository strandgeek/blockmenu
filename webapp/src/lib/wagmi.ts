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
