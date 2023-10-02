import type { Chain } from "../src/types";
export default {
  "chain": "HSC",
  "chainId": 70,
  "explorers": [
    {
      "name": "hooscan",
      "url": "https://www.hooscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.hoosmartchain.com",
  "name": "Hoo Smart Chain",
  "nativeCurrency": {
    "name": "Hoo Smart Chain Native Token",
    "symbol": "HOO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://hoo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.hoosmartchain.com",
    "https://http-mainnet2.hoosmartchain.com",
    "wss://ws-mainnet.hoosmartchain.com",
    "wss://ws-mainnet2.hoosmartchain.com"
  ],
  "shortName": "hsc",
  "slug": "hoo-smart-chain",
  "testnet": false
} as const satisfies Chain;