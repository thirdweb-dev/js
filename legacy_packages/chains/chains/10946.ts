import type { Chain } from "../src/types";
export default {
  "chain": "QDC",
  "chainId": 10946,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.quadrans.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://quadrans.io",
  "name": "Quadrans Blockchain",
  "nativeCurrency": {
    "name": "Quadrans Coin",
    "symbol": "QDC",
    "decimals": 18
  },
  "networkId": 10946,
  "rpc": [
    "https://10946.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.quadrans.io",
    "https://rpcna.quadrans.io",
    "https://rpceu.quadrans.io"
  ],
  "shortName": "quadrans",
  "slug": "quadrans-blockchain",
  "testnet": false
} as const satisfies Chain;