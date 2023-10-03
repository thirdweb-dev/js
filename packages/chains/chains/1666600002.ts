import type { Chain } from "../src/types";
export default {
  "chain": "Harmony",
  "chainId": 1666600002,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/2",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Mainnet Shard 2",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://harmony-shard-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s2.t.hmny.io"
  ],
  "shortName": "hmy-s2",
  "slug": "harmony-shard-2",
  "testnet": false
} as const satisfies Chain;