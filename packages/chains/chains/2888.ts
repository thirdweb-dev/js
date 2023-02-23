export default {
  "name": "Boba Network Goerli Testnet",
  "chain": "ETH",
  "rpc": [
    "https://boba-network-goerli-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.boba.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "Bobagoerli",
  "chainId": 2888,
  "networkId": 2888,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet.bobascan.com",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://gateway.goerli.boba.network"
      }
    ]
  },
  "testnet": true,
  "slug": "boba-network-goerli-testnet"
} as const;