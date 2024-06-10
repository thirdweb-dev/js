import type { Chain } from "../src/types";
export default {
  "chain": "ALTR",
  "chainId": 1971,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://1971.network/",
  "name": "Atelier",
  "nativeCurrency": {
    "name": "ATLR",
    "symbol": "ATLR",
    "decimals": 18
  },
  "networkId": 1971,
  "rpc": [
    "https://1971.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1971.network/atlr",
    "wss://1971.network/atlr"
  ],
  "shortName": "atlr",
  "slip44": 1,
  "slug": "atelier",
  "testnet": true,
  "title": "Atelier Test Network"
} as const satisfies Chain;