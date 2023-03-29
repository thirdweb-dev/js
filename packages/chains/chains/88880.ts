export default {
  "name": "Chiliz Scoville Testnet",
  "chain": "CHZ",
  "rpc": [
    "https://chiliz-scoville-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://scoville-rpc.chiliz.com"
  ],
  "faucets": [
    "https://scoville-faucet.chiliz.com"
  ],
  "nativeCurrency": {
    "name": "Chiliz",
    "symbol": "CHZ",
    "decimals": 18
  },
  "icon": {
    "url": "ipfs://QmYV5xUVZhHRzLy7ie9D8qZeygJHvNZZAxwnB9GXYy6EED",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://www.chiliz.com/en/chain",
  "shortName": "chz",
  "chainId": 88880,
  "networkId": 88880,
  "explorers": [
    {
      "name": "scoville-explorer",
      "url": "https://scoville-explorer.chiliz.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "chiliz-scoville-testnet"
} as const;