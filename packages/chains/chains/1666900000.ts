import type { Chain } from "../src/types";
export default {
  "chainId": 1666900000,
  "chain": "Harmony",
  "name": "Harmony Devnet Shard 0",
  "rpc": [
    "https://harmony-devnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.ps.hmny.io"
  ],
  "slug": "harmony-devnet-shard-0",
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-ps-s0",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;