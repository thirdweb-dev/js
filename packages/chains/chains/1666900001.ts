import type { Chain } from "../src/types";
export default {
  "chainId": 1666900001,
  "chain": "Harmony",
  "name": "Harmony Devnet Shard 1",
  "rpc": [
    "https://harmony-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.ps.hmny.io"
  ],
  "slug": "harmony-devnet-shard-1",
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-ps-s1",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;