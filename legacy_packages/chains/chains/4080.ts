import type { Chain } from "../src/types";
export default {
  "chain": "TBC",
  "chainId": 4080,
  "explorers": [
    {
      "name": "tobescan",
      "url": "https://tobescan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://tobechain.net",
  "name": "Tobe Chain",
  "nativeCurrency": {
    "name": "Tobe Coin",
    "symbol": "TBC",
    "decimals": 18
  },
  "networkId": 4080,
  "rpc": [
    "https://4080.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tobescan.com"
  ],
  "shortName": "tbc",
  "slug": "tobe-chain",
  "testnet": false
} as const satisfies Chain;