import type { Chain } from "../src/types";
export default {
  "name": "Harmony Mainnet Shard 0",
  "chain": "Harmony",
  "rpc": [
    "https://harmony-shard-0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.harmony.one",
    "https://a.api.s0.t.hmny.io",
    "https://api.s0.t.hmny.io",
    "https://rpc.ankr.com/harmony",
    "https://harmony.api.onfinality.io/public",
    "https://1rpc.io/one"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ONE",
    "symbol": "ONE",
    "decimals": 18
  },
  "infoURL": "https://www.harmony.one/",
  "slip44": 1023,
  "ens": {
    "registry": "0x4cd2563118e57b19179d8dc033f2b0c5b5d69ff5"
  },
  "shortName": "hmy-s0",
  "chainId": 1666600000,
  "networkId": 1666600000,
  "explorers": [
    {
      "name": "Harmony Block Explorer",
      "url": "https://explorer.harmony.one",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "harmony-shard-0"
} as const satisfies Chain;