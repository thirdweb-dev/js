import type { Chain } from "../src/types";
export default {
  "name": "Clover Testnet",
  "chain": "Clover",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Clover",
    "symbol": "CLV",
    "decimals": 18
  },
  "infoURL": "https://clover.finance",
  "shortName": "tclv",
  "chainId": 1023,
  "networkId": 1023,
  "testnet": true,
  "slug": "clover-testnet"
} as const satisfies Chain;