import type { Chain } from "../src/types";
export default {
  "chain": "MIX",
  "chainId": 76,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://mix-blockchain.org",
  "name": "Mix",
  "nativeCurrency": {
    "name": "Mix Ether",
    "symbol": "MIX",
    "decimals": 18
  },
  "networkId": 76,
  "rpc": [
    "https://76.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc2.mix-blockchain.org:8647"
  ],
  "shortName": "mix",
  "slip44": 76,
  "slug": "mix",
  "testnet": false
} as const satisfies Chain;