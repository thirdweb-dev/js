export default {
  "name": "Darwinia Network",
  "chain": "darwinia",
  "rpc": [
    "https://darwinia-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.darwinia.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Darwinia Network Native Token",
    "symbol": "RING",
    "decimals": 18
  },
  "infoURL": "https://darwinia.network/",
  "shortName": "darwinia",
  "chainId": 46,
  "networkId": 46,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://darwinia.subscan.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "darwinia-network"
} as const;