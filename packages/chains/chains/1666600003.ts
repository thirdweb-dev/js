import type { Chain } from "../src/types";
export default {
  "chain": "Harmony",
  "chainId": 1666600003,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/3",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Mainnet Shard 3",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://harmony-shard-3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s3.t.hmny.io"
  ],
  "shortName": "hmy-s3",
  "slug": "harmony-shard-3",
  "testnet": false
} as const satisfies Chain;