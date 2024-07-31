import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 480,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://worldcoin.org",
  "name": "World Chain",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 480,
  "rpc": [],
  "shortName": "wc",
  "slug": "world-chain",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;