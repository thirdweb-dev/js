import type { Chain } from "../src/types";
export default {
  "chainId": 1666700000,
  "chain": "Harmony",
  "name": "Harmony Testnet Shard 0",
  "rpc": [
    "https://harmony-testnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.b.hmny.io"
  ],
  "slug": "harmony-testnet-shard-0",
  "faucets": [
    "https://faucet.pops.one"
  ],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-b-s0",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Harmony Testnet Block Explorer",
      "url": "https://explorer.testnet.harmony.one",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;