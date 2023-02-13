export default {
  "name": "PandoProject Mainnet",
  "chain": "PandoProject",
  "icon": {
    "url": "ipfs://QmNduBtT5BNGDw7DjRwDvaZBb6gjxf46WD7BYhn4gauGc9",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "rpc": [
    "https://pandoproject.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api.pandoproject.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "pando-token",
    "symbol": "PTX",
    "decimals": 18
  },
  "infoURL": "https://www.pandoproject.org/",
  "shortName": "pando-mainnet",
  "chainId": 3601,
  "networkId": 3601,
  "explorers": [
    {
      "name": "Pando Mainnet Explorer",
      "url": "https://explorer.pandoproject.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "pandoproject"
} as const;