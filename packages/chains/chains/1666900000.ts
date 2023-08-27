import type { Chain } from "../src/types";
export default {
  "name": "Harmony Devnet Shard 0",
  "chain": "Harmony",
  "rpc": [
    "https://harmony-devnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.ps.hmny.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-ps-s0",
  "chainId": 1666900000,
  "networkId": 1666900000,
  "explorers": [],
  "testnet": false,
  "slug": "harmony-devnet-shard-0"
} as const satisfies Chain;