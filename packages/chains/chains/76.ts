import type { Chain } from "../src/types";
export default {
  "name": "Mix",
  "chain": "MIX",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Mix Ether",
    "symbol": "MIX",
    "decimals": 18
  },
  "infoURL": "https://mix-blockchain.org",
  "shortName": "mix",
  "chainId": 76,
  "networkId": 76,
  "slip44": 76,
  "testnet": false,
  "slug": "mix"
} as const satisfies Chain;