import type { Chain } from "../src/types";
export default {
  "chainId": 977,
  "chain": "YETI",
  "name": "Nepal Blockchain Network",
  "rpc": [
    "https://nepal-blockchain-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.nepalblockchain.dev",
    "https://api.nepalblockchain.network"
  ],
  "slug": "nepal-blockchain-network",
  "faucets": [
    "https://faucet.nepalblockchain.network"
  ],
  "nativeCurrency": {
    "name": "Nepal Blockchain Network Ether",
    "symbol": "YETI",
    "decimals": 18
  },
  "infoURL": "https://nepalblockchain.network",
  "shortName": "yeti",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;