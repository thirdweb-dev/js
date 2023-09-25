import type { Chain } from "../src/types";
export default {
  "chainId": 1666600002,
  "chain": "Harmony",
  "name": "Harmony Mainnet Shard 2",
  "rpc": [
    "https://harmony-shard-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s2.t.hmny.io"
  ],
  "slug": "harmony-shard-2",
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-s2",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/2",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;