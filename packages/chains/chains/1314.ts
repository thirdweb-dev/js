export default {
  "name": "Alyx Mainnet",
  "chain": "ALYX",
  "rpc": [
    "https://alyx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alyxchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Alyx Chain Native Token",
    "symbol": "ALYX",
    "decimals": 18
  },
  "infoURL": "https://www.alyxchain.com",
  "shortName": "alyx",
  "chainId": 1314,
  "networkId": 1314,
  "explorers": [
    {
      "name": "alyxscan",
      "url": "https://www.alyxscan.com",
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreifd43fcvh77mdcwjrpzpnlhthounc6b4u645kukqpqhduaveatf6i",
    "width": 2481,
    "height": 2481,
    "format": "png"
  },
  "testnet": false,
  "slug": "alyx"
} as const;