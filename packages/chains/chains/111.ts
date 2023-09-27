import type { Chain } from "../src/types";
export default {
  "name": "EtherLite Chain",
  "chain": "ETL",
  "rpc": [
    "https://etherlite-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etherlite.org"
  ],
  "faucets": [
    "https://etherlite.org/faucets"
  ],
  "nativeCurrency": {
    "name": "EtherLite",
    "symbol": "ETL",
    "decimals": 18
  },
  "infoURL": "https://etherlite.org",
  "shortName": "ETL",
  "chainId": 111,
  "networkId": 111,
  "icon": "etherlite",
  "testnet": false,
  "slug": "etherlite-chain"
} as const satisfies Chain;