export default {
  "name": "Aves Mainnet",
  "chain": "AVS",
  "rpc": [
    "https://aves.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.avescoin.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Aves",
    "symbol": "AVS",
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
  "infoURL": "https://avescoin.io",
  "shortName": "avs",
  "chainId": 33333,
  "networkId": 33333,
  "icon": {
    "url": "ipfs://QmeKQVv2QneHaaggw2NfpZ7DGMdjVhPywTdse5RzCs4oGn",
    "width": 232,
    "height": 232,
    "format": "png"
  },
  "explorers": [
    {
      "name": "avescan",
      "url": "https://avescan.io",
      "icon": "avescan",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "aves"
} as const;