export default {
  "name": "Metis Andromeda Mainnet",
  "chain": "ETH",
  "rpc": [
    "https://metis-andromeda.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://andromeda.metis.io/?owner=1088"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metis",
    "symbol": "METIS",
    "decimals": 18
  },
  "infoURL": "https://www.metis.io",
  "shortName": "metis-andromeda",
  "chainId": 1088,
  "networkId": 1088,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://andromeda-explorer.metis.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.metis.io"
      }
    ]
  },
  "testnet": false,
  "slug": "metis-andromeda"
} as const;