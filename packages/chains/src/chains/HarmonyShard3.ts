import type { Chain } from "../types";
export default {
  "chain": "Harmony",
  "chainId": 1666600003,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/3",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Mainnet Shard 3",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "networkId": 1666600003,
  "rpc": [
    "https://harmony-shard-3.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1666600003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s3.t.hmny.io"
  ],
  "shortName": "hmy-s3",
  "slip44": 1023,
  "slug": "harmony-shard-3",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;