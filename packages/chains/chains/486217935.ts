export default {
  "name": "Gather Devnet Network",
  "chain": "GTH",
  "rpc": [
    "https://gather-devnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.gather.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gather",
    "symbol": "GTH",
    "decimals": 18
  },
  "infoURL": "https://gather.network",
  "shortName": "dGTH",
  "chainId": 486217935,
  "networkId": 486217935,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://devnet-explorer.gather.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "gather-devnet-network"
} as const;