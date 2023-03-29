export default {
  "name": "Tomb Chain Mainnet",
  "chain": "Tomb Chain",
  "rpc": [
    "https://tomb-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tombchain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tomb",
    "symbol": "TOMB",
    "decimals": 18
  },
  "infoURL": "https://tombchain.com/",
  "shortName": "tombchain",
  "chainId": 6969,
  "networkId": 6969,
  "explorers": [
    {
      "name": "tombscout",
      "url": "https://tombscout.com",
      "standard": "none"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-250",
    "bridges": [
      {
        "url": "https://lif3.com/bridge"
      }
    ]
  },
  "testnet": false,
  "slug": "tomb-chain"
} as const;