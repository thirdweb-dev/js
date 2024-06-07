import type { Chain } from "../src/types";
export default {
  "chain": "ITX",
  "chainId": 5321,
  "explorers": [
    {
      "name": "ITX Testnet Explorer (Blockscout)",
      "url": "https://explorer.testnet.itxchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://explorer.testnet.itxchain.com",
  "name": "ITX Testnet",
  "nativeCurrency": {
    "name": "ITX",
    "symbol": "ITX",
    "decimals": 18
  },
  "networkId": 5321,
  "rpc": [
    "https://5321.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.itxchain.com"
  ],
  "shortName": "itx-testnet",
  "slug": "itx-testnet",
  "testnet": true
} as const satisfies Chain;