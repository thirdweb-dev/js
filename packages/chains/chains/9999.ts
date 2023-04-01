import type { Chain } from "../src/types";
export default {
  "name": "myOwn Testnet",
  "chain": "myOwn",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "MYN",
    "symbol": "MYN",
    "decimals": 18
  },
  "infoURL": "https://docs.bccloud.net/",
  "shortName": "myn",
  "chainId": 9999,
  "networkId": 9999,
  "testnet": true,
  "slug": "myown-testnet"
} as const satisfies Chain;