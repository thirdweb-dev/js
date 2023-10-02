import type { Chain } from "../src/types";
export default {
  "chain": "AQUA",
  "chainId": 61717561,
  "explorers": [],
  "faucets": [
    "https://aquacha.in/faucet"
  ],
  "features": [],
  "infoURL": "https://aquachain.github.io",
  "name": "Aquachain",
  "nativeCurrency": {
    "name": "Aquachain Ether",
    "symbol": "AQUA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://aquachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://c.onical.org",
    "https://tx.aquacha.in/api"
  ],
  "shortName": "aqua",
  "slug": "aquachain",
  "testnet": false
} as const satisfies Chain;