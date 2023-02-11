export default {
  "name": "Eurus Mainnet",
  "chain": "EUN",
  "rpc": [
    "https://eurus.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.eurus.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Eurus",
    "symbol": "EUN",
    "decimals": 18
  },
  "infoURL": "https://eurus.network",
  "shortName": "eun",
  "chainId": 1008,
  "networkId": 1008,
  "icon": {
    "url": "ipfs://QmaGd5L9jGPbfyGXBFhu9gjinWJ66YtNrXq8x6Q98Eep9e",
    "width": 471,
    "height": 471,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "eurusexplorer",
      "url": "https://explorer.eurus.network",
      "icon": "eurus",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "eurus"
} as const;