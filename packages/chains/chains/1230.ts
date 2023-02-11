export default {
  "name": "Ultron Testnet",
  "chain": "Ultron",
  "icon": {
    "url": "ipfs://QmS4W4kY7XYBA4f52vuuytXh3YaTcNBXF14V9tEY6SNqhz",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://ultron-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ultron-dev.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ultron",
    "symbol": "ULX",
    "decimals": 18
  },
  "infoURL": "https://ultron.foundation",
  "shortName": "UltronTestnet",
  "chainId": 1230,
  "networkId": 1230,
  "explorers": [
    {
      "name": "Ultron Testnet Explorer",
      "url": "https://explorer.ultron-dev.io",
      "icon": "ultron",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "ultron-testnet"
} as const;