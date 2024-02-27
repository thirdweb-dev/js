import type { Chain } from "../src/types";
export default {
  "chain": "Harmony",
  "chainId": 1666600002,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one/blocks/shard/2",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Mainnet Shard 2",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "networkId": 1666600002,
  "rpc": [
    "https://1666600002.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s2.t.hmny.io"
  ],
  "shortName": "hmy-s2",
  "slip44": 1023,
  "slug": "harmony-shard-2",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;