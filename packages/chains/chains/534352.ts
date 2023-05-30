import type { Chain } from "../src/types";
export default {
  "name": "Scroll",
  "chain": "ETH",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "shortName": "scr",
  "chainId": 534352,
  "networkId": 534352,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": []
  },
  "testnet": false,
  "slug": "scroll"
} as const satisfies Chain;