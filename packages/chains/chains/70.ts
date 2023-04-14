import type { Chain } from "../src/types";
export default {
  "name": "Hoo Smart Chain",
  "chain": "HSC",
  "rpc": [
    "https://hoo-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.hoosmartchain.com",
    "https://http-mainnet2.hoosmartchain.com",
    "wss://ws-mainnet.hoosmartchain.com",
    "wss://ws-mainnet2.hoosmartchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Hoo Smart Chain Native Token",
    "symbol": "HOO",
    "decimals": 18
  },
  "infoURL": "https://www.hoosmartchain.com",
  "shortName": "hsc",
  "chainId": 70,
  "networkId": 70,
  "slip44": 1170,
  "explorers": [
    {
      "name": "hooscan",
      "url": "https://www.hooscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "hoo-smart-chain"
} as const satisfies Chain;