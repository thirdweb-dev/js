import type { Chain } from "../src/types";
export default {
  "name": "muNode Testnet",
  "chain": "munode",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://munode.dev/",
  "shortName": "munode",
  "chainId": 956,
  "networkId": 956,
  "testnet": true,
  "slug": "munode-testnet"
} as const satisfies Chain;