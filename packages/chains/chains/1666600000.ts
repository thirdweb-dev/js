import type { Chain } from "../src/types";
export default {
  "chain": "Harmony",
  "chainId": 1666600000,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Mainnet Shard 0",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://harmony-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.harmony.one",
    "https://a.api.s0.t.hmny.io",
    "https://api.s0.t.hmny.io",
    "https://rpc.ankr.com/harmony",
    "https://harmony.api.onfinality.io/public",
    "https://1rpc.io/one"
  ],
  "shortName": "hmy-s0",
  "slug": "harmony-shard-0",
  "testnet": false
} as const satisfies Chain;