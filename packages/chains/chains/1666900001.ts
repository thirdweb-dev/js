import type { Chain } from "../src/types";
export default {
  "name": "Harmony Devnet Shard 1",
  "chain": "Harmony",
  "rpc": [
    "https://harmony-devnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.ps.hmny.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "shortName": "hmy-ps-s1",
  "chainId": 1666900001,
  "networkId": 1666900001,
  "explorers": [],
  "testnet": false,
  "slug": "harmony-devnet-shard-1"
} as const satisfies Chain;