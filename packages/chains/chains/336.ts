export default {
  "name": "Shiden",
  "chain": "SDN",
  "rpc": [
    "https://shiden.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://shiden.api.onfinality.io/public",
    "https://shiden-rpc.dwellir.com",
    "https://shiden.public.blastapi.io",
    "wss://shiden.api.onfinality.io/public-ws",
    "wss://shiden.public.blastapi.io",
    "wss://shiden-rpc.dwellir.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Shiden",
    "symbol": "SDN",
    "decimals": 18
  },
  "infoURL": "https://shiden.astar.network/",
  "shortName": "sdn",
  "chainId": 336,
  "networkId": 336,
  "icon": {
    "url": "ipfs://QmQySjAoWHgk3ou1yvBi2TrTcgH6KhfGiU7GcrLzrAeRkE",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "explorers": [
    {
      "name": "subscan",
      "url": "https://shiden.subscan.io",
      "standard": "none",
      "icon": "subscan"
    }
  ],
  "testnet": false,
  "slug": "shiden"
} as const;