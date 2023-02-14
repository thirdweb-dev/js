export default {
  "name": "PlatON Dev Testnet2",
  "chain": "PlatON",
  "rpc": [
    "https://platon-dev-testnet2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet2openapi.platon.network/rpc",
    "wss://devnet2openapi.platon.network/ws"
  ],
  "faucets": [
    "https://devnet2faucet.platon.network/faucet"
  ],
  "nativeCurrency": {
    "name": "LAT",
    "symbol": "lat",
    "decimals": 18
  },
  "infoURL": "https://www.platon.network",
  "shortName": "platondev2",
  "chainId": 2206132,
  "networkId": 1,
  "icon": {
    "url": "ipfs://QmT7PSXBiVBma6E15hNkivmstqLu3JSnG1jXN5pTmcCGRC",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "explorers": [
    {
      "name": "PlatON explorer",
      "url": "https://devnet2scan.platon.network",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "platon-dev-testnet2"
} as const;