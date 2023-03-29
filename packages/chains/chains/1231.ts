export default {
  "name": "Ultron Mainnet",
  "chain": "Ultron",
  "icon": {
    "url": "ipfs://QmS4W4kY7XYBA4f52vuuytXh3YaTcNBXF14V9tEY6SNqhz",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://ultron.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ultron-rpc.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ultron",
    "symbol": "ULX",
    "decimals": 18
  },
  "infoURL": "https://ultron.foundation",
  "shortName": "UtronMainnet",
  "chainId": 1231,
  "networkId": 1231,
  "explorers": [
    {
      "name": "Ultron Explorer",
      "url": "https://ulxscan.com",
      "icon": "ultron",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "ultron"
} as const;