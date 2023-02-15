export default {
  "name": "Darwinia Crab Network",
  "chain": "crab",
  "rpc": [
    "https://darwinia-crab-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://crab-rpc.darwinia.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Crab Network Native Token",
    "symbol": "CRAB",
    "decimals": 18
  },
  "infoURL": "https://crab.network/",
  "shortName": "crab",
  "chainId": 44,
  "networkId": 44,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://crab.subscan.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "darwinia-crab-network"
} as const;