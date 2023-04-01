import type { Chain } from "../src/types";
export default {
  "name": "MathChain Testnet",
  "chain": "MATH",
  "rpc": [],
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
  "chainId": 1140,
  "networkId": 1140,
  "testnet": true,
  "slug": "mathchain-testnet"
} as const satisfies Chain;