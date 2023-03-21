export default {
  "name": "T.E.A.M Blockchain",
  "chain": "TEAM",
  "rpc": [
    "https://t-e-a-m-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.teamblockchain.team"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TEAM",
    "symbol": "$TEAM",
    "decimals": 8
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://teamblockchain.team",
  "shortName": "team",
  "chainId": 88888888,
  "networkId": 88888888,
  "explorers": [
    {
      "icon": "team",
      "name": "teamscan",
      "url": "https://teamblockchain.team",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "t-e-a-m-blockchain"
} as const;