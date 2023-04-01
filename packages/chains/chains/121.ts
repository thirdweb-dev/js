import type { Chain } from "../src/types";
export default {
  "name": "Realchain Mainnet",
  "chain": "REAL",
  "rpc": [],
  "faucets": [
    "https://faucet.rclsidechain.com"
  ],
  "nativeCurrency": {
    "name": "Realchain",
    "symbol": "REAL",
    "decimals": 18
  },
  "infoURL": "https://www.rclsidechain.com/",
  "shortName": "REAL",
  "chainId": 121,
  "networkId": 121,
  "slip44": 714,
  "explorers": [
    {
      "name": "realscan",
      "url": "https://rclscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "realchain"
} as const satisfies Chain;