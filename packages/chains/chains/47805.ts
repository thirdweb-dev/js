export default {
  "name": "REI Network",
  "chain": "REI",
  "rpc": [
    "https://rei-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rei.network",
    "wss://rpc.rei.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "REI",
    "symbol": "REI",
    "decimals": 18
  },
  "infoURL": "https://rei.network/",
  "shortName": "REI",
  "chainId": 47805,
  "networkId": 47805,
  "explorers": [
    {
      "name": "rei-scan",
      "url": "https://scan.rei.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "rei-network"
} as const;