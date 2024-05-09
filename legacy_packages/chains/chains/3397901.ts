import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 3397901,
  "explorers": [
    {
      "name": "Funki Sepolia Sandbox Explorer",
      "url": "https://sepolia-sandbox.funkichain.com",
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
  "name": "Funki Sepolia Sandbox",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 3397901,
  "rpc": [
    "https://3397901.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://funki-testnet.alt.technology"
  ],
  "shortName": "funkisepolia",
  "slug": "funki-sepolia-sandbox",
  "testnet": true
} as const satisfies Chain;