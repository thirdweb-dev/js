import type { Chain } from "../src/types";
export default {
  "chain": "MATH",
  "chainId": 1139,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://mathchain.org",
  "name": "MathChain",
  "nativeCurrency": {
    "name": "MathChain",
    "symbol": "MATH",
    "decimals": 18
  },
  "networkId": 1139,
  "rpc": [
    "https://mathchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1139.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mathchain-asia.maiziqianbao.net/rpc",
    "https://mathchain-us.maiziqianbao.net/rpc"
  ],
  "shortName": "MATH",
  "slug": "mathchain",
  "testnet": false
} as const satisfies Chain;