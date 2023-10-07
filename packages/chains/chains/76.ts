import type { Chain } from "../src/types";
export default {
  "chain": "MIX",
  "chainId": 76,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://mix-blockchain.org",
  "name": "Mix",
  "nativeCurrency": {
    "name": "Mix Ether",
    "symbol": "MIX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://mix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc2.mix-blockchain.org:8647"
  ],
  "shortName": "mix",
  "slug": "mix",
  "testnet": false
} as const satisfies Chain;