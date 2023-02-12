export default {
  "name": "OpenVessel",
  "chain": "VSL",
  "icon": {
    "url": "ipfs://QmeknNzGCZXQK7egwfwyxQan7Lw8bLnqYsyoEgEbDNCzJX",
    "width": 600,
    "height": 529,
    "format": "png"
  },
  "rpc": [
    "https://openvessel.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-external.openvessel.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Vessel ETH",
    "symbol": "VETH",
    "decimals": 18
  },
  "infoURL": "https://www.openvessel.io",
  "shortName": "vsl",
  "chainId": 7355310,
  "networkId": 7355310,
  "explorers": [
    {
      "name": "openvessel-mainnet",
      "url": "https://mainnet-explorer.openvessel.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "openvessel"
} as const;