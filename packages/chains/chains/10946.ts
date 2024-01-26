import type { Chain } from "../src/types";
export default {
  "chain": "QDC",
  "chainId": 10946,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.quadrans.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmZFiYHnE4TrezPz8wSap9nMxG6m98w4fv7ataj2TfLNck",
        "width": 1024,
        "height": 1024,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZFiYHnE4TrezPz8wSap9nMxG6m98w4fv7ataj2TfLNck",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://quadrans.io",
  "name": "Quadrans Blockchain",
  "nativeCurrency": {
    "name": "Quadrans Coin",
    "symbol": "QDC",
    "decimals": 18
  },
  "networkId": 10946,
  "rpc": [
    "https://quadrans-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://10946.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.quadrans.io",
    "https://rpcna.quadrans.io",
    "https://rpceu.quadrans.io"
  ],
  "shortName": "quadrans",
  "slug": "quadrans-blockchain",
  "testnet": false
} as const satisfies Chain;