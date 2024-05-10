import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 33979,
  "explorers": [
    {
      "name": "Funki Mainnet Explorer",
      "url": "https://mainnet.funkichain.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWLjmfbjx2qZC39GCFXDzt72NXVTtDBVzVSq6rwaquyp3",
    "width": 1200,
    "height": 410,
    "format": "png"
  },
  "infoURL": "https://funkichain.com",
  "name": "Funki",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 33979,
  "rpc": [],
  "shortName": "funki",
  "slug": "funki",
  "testnet": false
} as const satisfies Chain;