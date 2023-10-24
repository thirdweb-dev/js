import type { Chain } from "../src/types";
export default {
  "chain": "munode",
  "chainId": 956,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://munode.dev/",
  "name": "muNode Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 956,
  "rpc": [],
  "shortName": "munode",
  "slug": "munode-testnet",
  "testnet": true
} as const satisfies Chain;