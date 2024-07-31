import type { Chain } from "../src/types";
export default {
  "chain": "OX",
  "chainId": 6699,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://ox.fun/chain",
  "name": "OX Chain",
  "nativeCurrency": {
    "name": "OX",
    "symbol": "OX",
    "decimals": 18
  },
  "networkId": 6699,
  "rpc": [
    "https://6699.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.oxscan.io"
  ],
  "shortName": "ox-chain",
  "slug": "ox-chain",
  "status": "incubating",
  "testnet": false,
  "title": "OX Chain"
} as const satisfies Chain;