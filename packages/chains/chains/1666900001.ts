import type { Chain } from "../src/types";
export default {
  "chain": "Harmony",
  "chainId": 1666900001,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Devnet Shard 1",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://harmony-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.ps.hmny.io"
  ],
  "shortName": "hmy-ps-s1",
  "slug": "harmony-devnet-shard-1",
  "testnet": false
} as const satisfies Chain;