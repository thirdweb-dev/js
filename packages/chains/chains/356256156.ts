export default {
  "name": "Gather Testnet Network",
  "chain": "GTH",
  "rpc": [
    "https://gather-testnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gather.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "infoURL": "https://gather.network",
  "shortName": "tGTH",
  "chainId": 356256156,
  "networkId": 356256156,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-explorer.gather.network",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "gather-testnet-network"
} as const;