export default {
  "name": "Excelon Mainnet",
  "chain": "XLON",
  "icon": {
    "url": "ipfs://QmTV45o4jTe6ayscF1XWh1WXk5DPck4QohR5kQocSWjvQP",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "rpc": [
    "https://excelon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://edgewallet1.xlon.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Excelon",
    "symbol": "xlon",
    "decimals": 18
  },
  "infoURL": "https://xlon.org",
  "shortName": "xlon",
  "chainId": 22052002,
  "networkId": 22052002,
  "explorers": [
    {
      "name": "Excelon explorer",
      "url": "https://explorer.excelon.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "excelon"
} as const;