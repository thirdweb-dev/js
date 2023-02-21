export default {
  "name": "Eurus Testnet",
  "chain": "EUN",
  "rpc": [
    "https://eurus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.eurus.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Eurus",
    "symbol": "EUN",
    "decimals": 18
  },
  "infoURL": "https://eurus.network",
  "shortName": "euntest",
  "chainId": 1984,
  "networkId": 1984,
  "icon": {
    "url": "ipfs://QmaGd5L9jGPbfyGXBFhu9gjinWJ66YtNrXq8x6Q98Eep9e",
    "width": 471,
    "height": 471,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "testnetexplorer",
      "url": "https://testnetexplorer.eurus.network",
      "icon": "eurus",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "eurus-testnet"
} as const;