import type { Chain } from "../types";
export default {
  "chain": "Harmony",
  "chainId": 1666700000,
  "explorers": [
    {
      "name": "Harmony Testnet Block Explorer",
      "url": "https://explorer.testnet.harmony.one",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.pops.one"
  ],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Testnet Shard 0",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "networkId": 1666700000,
  "rpc": [
    "https://harmony-testnet-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1666700000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.s0.b.hmny.io"
  ],
  "shortName": "hmy-b-s0",
  "slug": "harmony-testnet-shard-0",
  "testnet": true
} as const satisfies Chain;