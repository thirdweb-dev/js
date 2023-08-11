import type { Chain } from "../src/types";
export default {
  "name": "Harmony Mainnet Shard 3",
  "chain": "Harmony",
  "rpc": [
    "https://harmony-shard-3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s3.t.hmny.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "slip44": 1023,
  "shortName": "hmy-s3",
  "chainId": 1666600003,
  "networkId": 1666600003,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/3",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "harmony-shard-3"
} as const satisfies Chain;