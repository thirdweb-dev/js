export default {
  "name": "eCredits Mainnet",
  "chain": "ECS",
  "rpc": [
    "https://ecredits.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ecredits.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "infoURL": "https://ecredits.com",
  "shortName": "ecs",
  "chainId": 63000,
  "networkId": 63000,
  "icon": {
    "url": "ipfs://QmU9H9JE1KtLh2Fxrd8EWTMjKGJBpgRWKUeEx7u6ic4kBY",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "explorers": [
    {
      "name": "eCredits MainNet Explorer",
      "url": "https://explorer.ecredits.com",
      "icon": "ecredits",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ecredits"
} as const;