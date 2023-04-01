import type { Chain } from "../src/types";
export default {
  "name": "Nepal Blockchain Network",
  "chain": "YETI",
  "rpc": [],
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
  "chainId": 977,
  "networkId": 977,
  "testnet": false,
  "slug": "nepal-blockchain-network"
} as const satisfies Chain;