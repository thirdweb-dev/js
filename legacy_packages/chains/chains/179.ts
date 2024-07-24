import type { Chain } from "../src/types";
export default {
  "chain": "ABEY",
  "chainId": 179,
  "explorers": [
    {
      "name": "abeyscan",
      "url": "https://abeyscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://abey.com",
  "name": "ABEY Mainnet",
  "nativeCurrency": {
    "name": "ABEY",
    "symbol": "ABEY",
    "decimals": 18
  },
  "networkId": 179,
  "rpc": [
    "https://179.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.abeychain.com"
  ],
  "shortName": "abey",
  "slug": "abey",
  "testnet": false
} as const satisfies Chain;