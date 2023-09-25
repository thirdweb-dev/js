import type { Chain } from "../src/types";
export default {
  "chainId": 1139,
  "chain": "MATH",
  "name": "MathChain",
  "rpc": [
    "https://mathchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mathchain-asia.maiziqianbao.net/rpc",
    "https://mathchain-us.maiziqianbao.net/rpc"
  ],
  "slug": "mathchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "MathChain",
    "symbol": "MATH",
    "decimals": 18
  },
  "infoURL": "https://mathchain.org",
  "shortName": "MATH",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;