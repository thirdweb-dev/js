import type { Chain } from "../src/types";
export default {
  "chainId": 1666700001,
  "chain": "Harmony",
  "name": "Harmony Testnet Shard 1",
  "rpc": [
    "https://harmony-testnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.b.hmny.io"
  ],
  "slug": "harmony-testnet-shard-1",
  "faucets": [
    "https://faucet.pops.one"
  ],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-b-s1",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.testnet.harmony.one",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;