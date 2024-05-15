import type { Chain } from "../src/types";
export default {
  "chain": "Coordinape Testnet",
  "chainId": 5103,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://coordinape.com/",
  "name": "Coordinape Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 5103,
  "rpc": [
    "https://5103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-coordinape-testnet-vs9se3oc4v.t.conduit.xyz"
  ],
  "shortName": "coordinape-testnet",
  "slug": "coordinape-testnet",
  "testnet": true
} as const satisfies Chain;