export default {
  "name": "PandoProject Testnet",
  "chain": "PandoProject",
  "icon": {
    "url": "ipfs://QmNduBtT5BNGDw7DjRwDvaZBb6gjxf46WD7BYhn4gauGc9",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "rpc": [
    "https://pandoproject-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.ethrpc.pandoproject.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "pando-token",
    "symbol": "PTX",
    "decimals": 18
  },
  "infoURL": "https://www.pandoproject.org/",
  "shortName": "pando-testnet",
  "chainId": 3602,
  "networkId": 3602,
  "explorers": [
    {
      "name": "Pando Testnet Explorer",
      "url": "https://testnet.explorer.pandoproject.org",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "pandoproject-testnet"
} as const;