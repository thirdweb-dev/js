import type { Chain } from "../src/types";
export default {
  "chainId": 1140,
  "chain": "MATH",
  "name": "MathChain Testnet",
  "rpc": [
    "https://mathchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://galois-hk.maiziqianbao.net/rpc"
  ],
  "slug": "mathchain-testnet",
  "faucets": [
    "https://scan.boka.network/#/Galois/faucet"
  ],
  "nativeCurrency": {
    "name": "MathChain",
    "symbol": "MATH",
    "decimals": 18
  },
  "infoURL": "https://mathchain.org",
  "shortName": "tMATH",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;