import type { Chain } from "../src/types";
export default {
  "chainId": 61717561,
  "chain": "AQUA",
  "name": "Aquachain",
  "rpc": [
    "https://aquachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://c.onical.org",
    "https://tx.aquacha.in/api"
  ],
  "slug": "aquachain",
  "faucets": [
    "https://aquacha.in/faucet"
  ],
  "nativeCurrency": {
    "name": "Aquachain Ether",
    "symbol": "AQUA",
    "decimals": 18
  },
  "infoURL": "https://aquachain.github.io",
  "shortName": "aqua",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;