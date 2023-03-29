export default {
  "name": "TechPay Mainnet",
  "chain": "TPC",
  "rpc": [
    "https://techpay.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.techpay.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TechPay",
    "symbol": "TPC",
    "decimals": 18
  },
  "infoURL": "https://techpay.io/",
  "shortName": "tpc",
  "chainId": 2569,
  "networkId": 2569,
  "icon": {
    "url": "ipfs://QmQyTyJUnhD1dca35Vyj96pm3v3Xyw8xbG9m8HXHw3k2zR",
    "width": 578,
    "height": 701,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "tpcscan",
      "url": "https://tpcscan.com",
      "icon": "techpay",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "techpay"
} as const;