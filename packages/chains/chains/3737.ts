export default {
  "name": "Crossbell",
  "chain": "Crossbell",
  "rpc": [
    "https://crossbell.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.crossbell.io"
  ],
  "faucets": [
    "https://faucet.crossbell.io"
  ],
  "nativeCurrency": {
    "name": "Crossbell Token",
    "symbol": "CSB",
    "decimals": 18
  },
  "infoURL": "https://crossbell.io",
  "shortName": "csb",
  "chainId": 3737,
  "networkId": 3737,
  "icon": {
    "url": "ipfs://QmS8zEetTb6pwdNpVjv5bz55BXiSMGP9BjTJmNcjcUT91t",
    "format": "svg",
    "width": 408,
    "height": 408
  },
  "explorers": [
    {
      "name": "Crossbell Explorer",
      "url": "https://scan.crossbell.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "crossbell"
} as const;