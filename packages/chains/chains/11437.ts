import type { Chain } from "../src/types";
export default {
  "chain": "SHYFTT",
  "chainId": 11437,
  "explorers": [
    {
      "name": "Shyft Testnet BX",
      "url": "https://bx.testnet.shyft.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://shyft.network",
  "name": "Shyft Testnet",
  "nativeCurrency": {
    "name": "Shyft Test Token",
    "symbol": "SHYFTT",
    "decimals": 18
  },
  "networkId": 11437,
  "rpc": [],
  "shortName": "shyftt",
  "slip44": 1,
  "slug": "shyft-testnet",
  "testnet": true
} as const satisfies Chain;