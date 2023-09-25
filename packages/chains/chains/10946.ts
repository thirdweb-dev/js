import type { Chain } from "../src/types";
export default {
  "chainId": 10946,
  "chain": "QDC",
  "name": "Quadrans Blockchain",
  "rpc": [
    "https://quadrans-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.quadrans.io",
    "https://rpcna.quadrans.io",
    "https://rpceu.quadrans.io"
  ],
  "slug": "quadrans-blockchain",
  "icon": {
    "url": "ipfs://QmZFiYHnE4TrezPz8wSap9nMxG6m98w4fv7ataj2TfLNck",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Quadrans Coin",
    "symbol": "QDC",
    "decimals": 18
  },
  "infoURL": "https://quadrans.io",
  "shortName": "quadrans",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.quadrans.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;