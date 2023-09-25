import type { Chain } from "../src/types";
export default {
  "chainId": 76,
  "chain": "MIX",
  "name": "Mix",
  "rpc": [
    "https://mix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc2.mix-blockchain.org:8647"
  ],
  "slug": "mix",
  "faucets": [],
  "nativeCurrency": {
    "name": "Mix Ether",
    "symbol": "MIX",
    "decimals": 18
  },
  "infoURL": "https://mix-blockchain.org",
  "shortName": "mix",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;