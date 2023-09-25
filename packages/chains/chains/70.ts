import type { Chain } from "../src/types";
export default {
  "chainId": 70,
  "chain": "HSC",
  "name": "Hoo Smart Chain",
  "rpc": [
    "https://hoo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.hoosmartchain.com",
    "https://http-mainnet2.hoosmartchain.com",
    "wss://ws-mainnet.hoosmartchain.com",
    "wss://ws-mainnet2.hoosmartchain.com"
  ],
  "slug": "hoo-smart-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Hoo Smart Chain Native Token",
    "symbol": "HOO",
    "decimals": 18
  },
  "infoURL": "https://www.hoosmartchain.com",
  "shortName": "hsc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "hooscan",
      "url": "https://www.hooscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;