import type { Chain } from "../types";
export default {
  "chain": "Harmony",
  "chainId": 1666600000,
  "ens": {
    "registry": "0x4cd2563118e57b19179d8dc033f2b0c5b5d69ff5"
  },
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.harmony.one/",
  "name": "Harmony Mainnet Shard 0",
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "networkId": 1666600000,
  "rpc": [
    "https://harmony-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1666600000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.harmony.one",
    "https://a.api.s0.t.hmny.io",
    "https://api.s0.t.hmny.io",
    "https://rpc.ankr.com/harmony",
    "https://harmony.api.onfinality.io/public",
    "https://1rpc.io/one"
  ],
  "shortName": "hmy-s0",
  "slip44": 1023,
  "slug": "harmony-shard-0",
  "testnet": false
} as const satisfies Chain;