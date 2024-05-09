import type { Chain } from "../src/types";
export default {
  "chain": "CREDIT",
  "chainId": 4400,
  "explorers": [
    {
      "name": "Creditscan",
      "url": "https://scan.creditsmartchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://creditsmartchain.com",
  "name": "Credit Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "Credit",
    "symbol": "CREDIT",
    "decimals": 18
  },
  "networkId": 4400,
  "rpc": [
    "https://4400.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.creditsmartchain.com"
  ],
  "shortName": "CreditEdge",
  "slug": "credit-smart-chain",
  "testnet": false
} as const satisfies Chain;