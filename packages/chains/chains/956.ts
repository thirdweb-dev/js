import type { Chain } from "../src/types";
export default {
  "chain": "munode",
  "chainId": 956,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://munode.dev/",
  "name": "muNode Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "munode",
  "slug": "munode-testnet",
  "testnet": true
} as const satisfies Chain;