export default {
  "name": "Credit Smartchain Mainnet",
  "chain": "CREDIT",
  "rpc": [
    "https://credit-smartchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.cscscan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Credit",
    "symbol": "CREDIT",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://creditsmartchain.com",
  "shortName": "Credit",
  "chainId": 13308,
  "networkId": 1,
  "icon": {
    "url": "ipfs://bafkreifbso3gd4wu5wxl27xyurxctmuae2jyuy37guqtzx23nga6ba4ag4",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "explorers": [
    {
      "name": "CSC Scan",
      "url": "https://explorer.cscscan.io",
      "icon": "credit",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "credit-smartchain"
} as const;