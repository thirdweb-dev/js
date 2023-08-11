import type { Chain } from "../src/types";
export default {
  "name": "Harmony Mainnet Shard 2",
  "chain": "Harmony",
  "rpc": [
    "https://harmony-shard-2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s2.t.hmny.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "slip44": 1023,
  "shortName": "hmy-s2",
  "chainId": 1666600002,
  "networkId": 1666600002,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/2",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "harmony-shard-2"
} as const satisfies Chain;