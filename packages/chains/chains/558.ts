import type { Chain } from "../src/types";
export default {
  "name": "Tao Network",
  "chain": "TAO",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tao",
    "symbol": "TAO",
    "decimals": 18
  },
  "infoURL": "https://tao.network",
  "shortName": "tao",
  "chainId": 558,
  "networkId": 558,
  "testnet": true,
  "slug": "tao-network"
} as const satisfies Chain;