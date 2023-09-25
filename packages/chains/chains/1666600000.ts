import type { Chain } from "../src/types";
export default {
  "chainId": 1666600000,
  "chain": "Harmony",
  "name": "Harmony Mainnet Shard 0",
  "rpc": [
    "https://harmony-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.harmony.one",
    "https://a.api.s0.t.hmny.io",
    "https://api.s0.t.hmny.io",
    "https://rpc.ankr.com/harmony",
    "https://harmony.api.onfinality.io/public",
    "https://1rpc.io/one"
  ],
  "slug": "harmony-shard-0",
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-s0",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;