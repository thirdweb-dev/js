export default {
  "name": "Rabbit Analog Testnet Chain",
  "chain": "rAna",
  "icon": {
    "url": "ipfs://QmdfbjjF3ZzN2jTkH9REgrA8jDS6A6c21n7rbWSVbSnvQc",
    "width": 310,
    "height": 251,
    "format": "svg"
  },
  "rpc": [
    "https://rabbit-analog-testnet-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rabbit.analog-rpc.com"
  ],
  "faucets": [
    "https://analogfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Rabbit Analog Test Chain Native Token ",
    "symbol": "rAna",
    "decimals": 18
  },
  "infoURL": "https://rabbit.analogscan.com",
  "shortName": "rAna",
  "chainId": 1807,
  "networkId": 1807,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://rabbit.analogscan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "rabbit-analog-testnet-chain"
} as const;