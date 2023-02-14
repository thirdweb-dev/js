export default {
  "name": "Mammoth Mainnet",
  "title": "Mammoth Chain",
  "chain": "MMT",
  "rpc": [
    "https://mammoth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.mmtscan.io",
    "https://dataseed1.mmtscan.io",
    "https://dataseed2.mmtscan.io"
  ],
  "faucets": [
    "https://faucet.mmtscan.io/"
  ],
  "nativeCurrency": {
    "name": "Mammoth Token",
    "symbol": "MMT",
    "decimals": 18
  },
  "infoURL": "https://mmtchain.io/",
  "shortName": "mmt",
  "chainId": 8898,
  "networkId": 8898,
  "icon": {
    "url": "ipfs://QmaF5gi2CbDKsJ2UchNkjBqmWjv8JEDP3vePBmxeUHiaK4",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "explorers": [
    {
      "name": "mmtscan",
      "url": "https://mmtscan.io",
      "standard": "EIP3091",
      "icon": "mmt"
    }
  ],
  "testnet": false,
  "slug": "mammoth"
} as const;