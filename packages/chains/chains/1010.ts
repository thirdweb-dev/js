export default {
  "name": "Evrice Network",
  "chain": "EVC",
  "rpc": [
    "https://evrice-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://meta.evrice.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Evrice",
    "symbol": "EVC",
    "decimals": 18
  },
  "infoURL": "https://evrice.com",
  "shortName": "EVC",
  "chainId": 1010,
  "networkId": 1010,
  "slip44": 1020,
  "testnet": false,
  "slug": "evrice-network"
} as const;