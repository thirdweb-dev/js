export default {
  "name": "BON Network",
  "chain": "BON",
  "rpc": [
    "https://bon-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.boyanet.org:8545",
    "ws://rpc.boyanet.org:8546"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BOYACoin",
    "symbol": "BOY",
    "decimals": 18
  },
  "infoURL": "https://boyanet.org",
  "shortName": "boya",
  "chainId": 1898,
  "networkId": 1,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.boyanet.org:4001",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bon-network"
} as const;