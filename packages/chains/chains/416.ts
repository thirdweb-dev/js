export default {
  "name": "SX Network Mainnet",
  "chain": "SX",
  "icon": {
    "url": "ipfs://QmSXLXqyr2H6Ja5XrmznXbWTEvF2gFaL8RXNXgyLmDHjAF",
    "width": 896,
    "height": 690,
    "format": "png"
  },
  "rpc": [
    "https://sx-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sx.technology"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SX Network",
    "symbol": "SX",
    "decimals": 18
  },
  "infoURL": "https://www.sx.technology",
  "shortName": "SX",
  "chainId": 416,
  "networkId": 416,
  "explorers": [
    {
      "name": "SX Network Explorer",
      "url": "https://explorer.sx.technology",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "sx-network"
} as const;