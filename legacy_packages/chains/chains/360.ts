import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 360,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://shape.us",
  "name": "Shape",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 360,
  "rpc": [],
  "shortName": "shape",
  "slug": "shape",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;