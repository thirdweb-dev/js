import type { Chain } from "../src/types";
export default {
  "chain": "YETI",
  "chainId": 977,
  "explorers": [],
  "faucets": [
    "https://faucet.nepalblockchain.network"
  ],
  "features": [],
  "infoURL": "https://nepalblockchain.network",
  "name": "Nepal Blockchain Network",
  "nativeCurrency": {
    "name": "Nepal Blockchain Network Ether",
    "symbol": "YETI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://nepal-blockchain-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.nepalblockchain.dev",
    "https://api.nepalblockchain.network"
  ],
  "shortName": "yeti",
  "slug": "nepal-blockchain-network",
  "testnet": false
} as const satisfies Chain;