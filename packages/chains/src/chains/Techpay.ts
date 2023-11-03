import type { Chain } from "../types";
export default {
  "chain": "TPC",
  "chainId": 2569,
  "explorers": [
    {
      "name": "tpcscan",
      "url": "https://tpcscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmQyTyJUnhD1dca35Vyj96pm3v3Xyw8xbG9m8HXHw3k2zR",
        "width": 578,
        "height": 701,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQyTyJUnhD1dca35Vyj96pm3v3Xyw8xbG9m8HXHw3k2zR",
    "width": 578,
    "height": 701,
    "format": "svg"
  },
  "infoURL": "https://techpay.io/",
  "name": "TechPay Mainnet",
  "nativeCurrency": {
    "name": "TechPay",
    "symbol": "TPC",
    "decimals": 18
  },
  "networkId": 2569,
  "rpc": [
    "https://techpay.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2569.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.techpay.io/"
  ],
  "shortName": "tpc",
  "slug": "techpay",
  "testnet": false
} as const satisfies Chain;