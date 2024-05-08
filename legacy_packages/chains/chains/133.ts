import type { Chain } from "../src/types";
export default {
  "chain": "HashKey Chain Testnet",
  "chainId": 133,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://hashkey.cloud",
  "name": "HashKey Chain Testnet",
  "nativeCurrency": {
    "name": "HashKey EcoPoints",
    "symbol": "HSK",
    "decimals": 18
  },
  "networkId": 133,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "rpc": [],
  "shortName": "HSKT",
  "slug": "hashkey-chain-testnet",
  "testnet": true,
  "title": "HashKey Chain Testnet"
} as const satisfies Chain;