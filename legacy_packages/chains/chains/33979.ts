import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 33979,
  "explorers": [
    {
      "name": "FunkiScan",
      "url": "https://funkiscan.io",
      "standard": "none"
    },
    {
      "name": "Funki Mainnet Explorer",
      "url": "https://funki.superscan.network",
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
  "rpc": [
    "https://33979.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.funkichain.com",
    "wss://rpc-mainnet.funkichain.com"
  ],
  "shortName": "funki",
  "slug": "funki",
  "testnet": false
} as const satisfies Chain;