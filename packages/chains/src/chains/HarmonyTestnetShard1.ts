import type { Chain } from "../types";
export default {
  "chain": "Harmony",
  "chainId": 1666700001,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.testnet.harmony.one",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.pops.one"
  ],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Testnet Shard 1",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "networkId": 1666700001,
  "rpc": [
    "https://harmony-testnet-shard-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1666700001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s1.b.hmny.io"
  ],
  "shortName": "hmy-b-s1",
  "slug": "harmony-testnet-shard-1",
  "testnet": true
} as const satisfies Chain;