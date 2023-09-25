import type { Chain } from "../src/types";
export default {
  "chainId": 13308,
  "chain": "CREDIT",
  "name": "Credit Smart Chain",
  "rpc": [
    "https://credit-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.creditsmartchain.com"
  ],
  "slug": "credit-smart-chain",
  "icon": {
    "url": "ipfs://bafkreifbso3gd4wu5wxl27xyurxctmuae2jyuy37guqtzx23nga6ba4ag4",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Credit",
    "symbol": "CREDIT",
    "decimals": 18
  },
  "infoURL": "https://creditsmartchain.com",
  "shortName": "Credit",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Creditscan",
      "url": "https://scan.creditsmartchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;