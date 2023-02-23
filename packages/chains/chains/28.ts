export default {
  "name": "Boba Network Rinkeby Testnet",
  "chain": "ETH",
  "rpc": [
    "https://boba-network-rinkeby-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rinkeby.boba.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaRinkeby",
  "chainId": 28,
  "networkId": 28,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://blockexplorer.rinkeby.boba.network",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-4",
    "bridges": [
      {
        "url": "https://gateway.rinkeby.boba.network"
      }
    ]
  },
  "testnet": true,
  "slug": "boba-network-rinkeby-testnet"
} as const;