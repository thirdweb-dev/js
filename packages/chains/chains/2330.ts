export default {
  "name": "Altcoinchain",
  "chain": "mainnet",
  "rpc": [
    "https://altcoinchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc0.altcoinchain.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Altcoin",
    "symbol": "ALT",
    "decimals": 18
  },
  "infoURL": "https://altcoinchain.org",
  "shortName": "alt",
  "chainId": 2330,
  "networkId": 2330,
  "icon": {
    "url": "ipfs://QmYwHmGC9CRVcKo1LSesqxU31SDj9vk2iQxcFjQArzhix4",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "status": "active",
  "explorers": [
    {
      "name": "expedition",
      "url": "http://expedition.altcoinchain.org",
      "icon": "altcoinchain",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "altcoinchain"
} as const;