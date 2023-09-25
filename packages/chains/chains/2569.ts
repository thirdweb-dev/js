import type { Chain } from "../src/types";
export default {
  "chainId": 2569,
  "chain": "TPC",
  "name": "TechPay Mainnet",
  "rpc": [
    "https://techpay.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.techpay.io/"
  ],
  "slug": "techpay",
  "icon": {
    "url": "ipfs://QmQyTyJUnhD1dca35Vyj96pm3v3Xyw8xbG9m8HXHw3k2zR",
    "width": 578,
    "height": 701,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "TechPay",
    "symbol": "TPC",
    "decimals": 18
  },
  "infoURL": "https://techpay.io/",
  "shortName": "tpc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "tpcscan",
      "url": "https://tpcscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;