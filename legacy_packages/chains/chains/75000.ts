import type { Chain } from "../src/types";
export default {
  "chain": "RESIN",
  "chainId": 75000,
  "explorers": [
    {
      "name": "ResinScan",
      "url": "https://explorer.resincoin.dev",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://resincoin.dev",
  "name": "ResinCoin Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "RESIN",
    "decimals": 18
  },
  "networkId": 75000,
  "rpc": [],
  "shortName": "resin",
  "slug": "resincoin",
  "testnet": false
} as const satisfies Chain;