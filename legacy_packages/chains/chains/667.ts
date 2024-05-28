import type { Chain } from "../src/types";
export default {
  "chain": "LAOS",
  "chainId": 667,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://arrakis.gorengine.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.laosfoundation.io/",
  "name": "LAOS Arrakis",
  "nativeCurrency": {
    "name": "LAOS",
    "symbol": "LAOS",
    "decimals": 18
  },
  "networkId": 667,
  "rpc": [
    "https://667.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://arrakis.gorengine.com/own",
    "wss://arrakis.gorengine.com/own"
  ],
  "shortName": "laos",
  "slug": "laos-arrakis",
  "testnet": true,
  "title": "LAOS Testnet Arrakis"
} as const satisfies Chain;