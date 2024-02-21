import type { Chain } from "../src/types";
export default {
  "chain": "CREDIT",
  "chainId": 4400,
  "explorers": [
    {
      "name": "Creditscan",
      "url": "https://scan.creditsmartchain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreifbso3gd4wu5wxl27xyurxctmuae2jyuy37guqtzx23nga6ba4ag4",
        "width": 1000,
        "height": 1628,
        "format": "png"
      }
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
  "icon": {
    "url": "ipfs://bafkreifbso3gd4wu5wxl27xyurxctmuae2jyuy37guqtzx23nga6ba4ag4",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
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