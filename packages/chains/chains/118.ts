export default {
  "name": "Arcology Testnet",
  "chain": "Arcology",
  "icon": {
    "url": "ipfs://QmRD7itMvaZutfBjyA7V9xkMGDtsZiJSagPwd3ijqka8kE",
    "width": 288,
    "height": 288,
    "format": "png"
  },
  "rpc": [
    "https://arcology-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.arcology.network/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Arcology Coin",
    "symbol": "Acol",
    "decimals": 18
  },
  "infoURL": "https://arcology.network/",
  "shortName": "arcology",
  "chainId": 118,
  "networkId": 118,
  "explorers": [
    {
      "name": "arcology",
      "url": "https://testnet.arcology.network/explorer",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "arcology-testnet"
} as const;