import type { Chain } from "../src/types";
export default {
  "name": "Rikeza Network Testnet",
  "title": "Rikeza Network Testnet",
  "chain": "Rikeza",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rikeza",
    "symbol": "RIK",
    "decimals": 18
  },
  "infoURL": "https://rikeza.io",
  "shortName": "tRIK",
  "chainId": 12715,
  "networkId": 12715,
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://testnet.rikscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "rikeza-network-testnet"
} as const satisfies Chain;