import type { Chain } from "../src/types";
export default {
  "chain": "Harmony",
  "chainId": 1666900000,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Devnet Shard 0",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "networkId": 1666900000,
  "rpc": [
    "https://harmony-devnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1666900000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.ps.hmny.io"
  ],
  "shortName": "hmy-ps-s0",
  "slug": "harmony-devnet-shard-0",
  "testnet": false
} as const satisfies Chain;