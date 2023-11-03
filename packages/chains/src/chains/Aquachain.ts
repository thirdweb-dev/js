import type { Chain } from "../types";
export default {
  "chain": "AQUA",
  "chainId": 61717561,
  "explorers": [],
  "faucets": [
    "https://aquacha.in/faucet"
  ],
  "infoURL": "https://aquachain.github.io",
  "name": "Aquachain",
  "nativeCurrency": {
    "name": "Aquachain Ether",
    "symbol": "AQUA",
    "decimals": 18
  },
  "networkId": 61717561,
  "rpc": [
    "https://aquachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://61717561.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://c.onical.org",
    "https://tx.aquacha.in/api"
  ],
  "shortName": "aqua",
  "slip44": 61717561,
  "slug": "aquachain",
  "testnet": false
} as const satisfies Chain;