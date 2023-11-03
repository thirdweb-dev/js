import type { Chain } from "../types";
export default {
  "chain": "MATH",
  "chainId": 1140,
  "explorers": [],
  "faucets": [
    "https://scan.boka.network/#/Galois/faucet"
  ],
  "infoURL": "https://mathchain.org",
  "name": "MathChain Testnet",
  "nativeCurrency": {
    "name": "MathChain",
    "symbol": "MATH",
    "decimals": 18
  },
  "networkId": 1140,
  "rpc": [
    "https://mathchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1140.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://galois-hk.maiziqianbao.net/rpc"
  ],
  "shortName": "tMATH",
  "slug": "mathchain-testnet",
  "testnet": true
} as const satisfies Chain;