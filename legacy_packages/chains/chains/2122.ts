import type { Chain } from "../src/types";
export default {
  "chain": "METAD",
  "chainId": 2122,
  "explorers": [
    {
      "name": "Metad Scan",
      "url": "https://scan.metaplayer.one",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://docs.metaplayer.one/",
  "name": "Metaplayerone Mainnet",
  "nativeCurrency": {
    "name": "METAD",
    "symbol": "METAD",
    "decimals": 18
  },
  "networkId": 2122,
  "rpc": [
    "https://2122.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metaplayer.one/"
  ],
  "shortName": "Metad",
  "slug": "metaplayerone",
  "testnet": false
} as const satisfies Chain;