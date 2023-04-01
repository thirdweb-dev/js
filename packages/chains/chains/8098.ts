import type { Chain } from "../src/types";
export default {
  "name": "StreamuX Blockchain",
  "chain": "StreamuX",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "StreamuX",
    "symbol": "SmuX",
    "decimals": 18
  },
  "infoURL": "https://www.streamux.cloud",
  "shortName": "StreamuX",
  "chainId": 8098,
  "networkId": 8098,
  "testnet": false,
  "slug": "streamux-blockchain"
} as const satisfies Chain;