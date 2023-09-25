import type { Chain } from "../src/types";
export default {
  "chainId": 1666600001,
  "chain": "Harmony",
  "name": "Harmony Mainnet Shard 1",
  "rpc": [
    "https://harmony-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.t.hmny.io"
  ],
  "slug": "harmony-shard-1",
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-s1",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/1",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;