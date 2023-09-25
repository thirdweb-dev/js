import type { Chain } from "../src/types";
export default {
  "chainId": 956,
  "chain": "munode",
  "name": "muNode Testnet",
  "rpc": [],
  "slug": "munode-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://munode.dev/",
  "shortName": "munode",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;