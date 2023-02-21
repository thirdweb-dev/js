export default {
  "name": "Boba Network",
  "chain": "ETH",
  "rpc": [
    "https://boba-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.boba.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "Boba",
  "chainId": 288,
  "networkId": 288,
  "explorers": [
    {
      "name": "Bobascan",
      "url": "https://bobascan.com",
      "standard": "none"
    },
    {
      "name": "Blockscout",
      "url": "https://blockexplorer.boba.network",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://gateway.boba.network"
      }
    ]
  },
  "testnet": false,
  "slug": "boba-network"
} as const;