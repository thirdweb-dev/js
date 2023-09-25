import type { Chain } from "../src/types";
export default {
  "chainId": 1666600003,
  "chain": "Harmony",
  "name": "Harmony Mainnet Shard 3",
  "rpc": [
    "https://harmony-shard-3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s3.t.hmny.io"
  ],
  "slug": "harmony-shard-3",
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-s3",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/3",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;