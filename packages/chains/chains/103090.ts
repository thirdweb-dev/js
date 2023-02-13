export default {
  "name": "Crystaleum",
  "chain": "crystal",
  "rpc": [
    "https://crystaleum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.cryptocurrencydevs.org",
    "https://rpc.crystaleum.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CRFI",
    "symbol": "◈",
    "decimals": 18
  },
  "infoURL": "https://crystaleum.org",
  "shortName": "CRFI",
  "chainId": 103090,
  "networkId": 1,
  "icon": {
    "url": "ipfs://Qmbry1Uc6HnXmqFNXW5dFJ7To8EezCCjNr4TqqvAyzXS4h",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.crystaleum.org",
      "icon": "crystal",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "crystaleum"
} as const;