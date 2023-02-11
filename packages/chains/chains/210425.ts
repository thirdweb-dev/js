export default {
  "name": "PlatON Mainnet",
  "chain": "PlatON",
  "rpc": [
    "https://platon.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://openapi2.platon.network/rpc",
    "wss://openapi2.platon.network/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LAT",
    "symbol": "lat",
    "decimals": 18
  },
  "infoURL": "https://www.platon.network",
  "shortName": "platon",
  "chainId": 210425,
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
      "url": "https://scan.platon.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "platon"
} as const;