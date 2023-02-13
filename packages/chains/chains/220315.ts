export default {
  "name": "Mas Mainnet",
  "chain": "MAS",
  "rpc": [
    "https://mas.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://node.masnet.ai:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Master Bank",
    "symbol": "MAS",
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
  "infoURL": "https://masterbank.org",
  "shortName": "mas",
  "chainId": 220315,
  "networkId": 220315,
  "icon": {
    "url": "ipfs://QmZ9njQhhKkpJKGnoYy6XTuDtk5CYiDFUd8atqWthqUT3Q",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "explorers": [
    {
      "name": "explorer masnet",
      "url": "https://explorer.masnet.ai",
      "icon": "explorer",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "mas"
} as const;