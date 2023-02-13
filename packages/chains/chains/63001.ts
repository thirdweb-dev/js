export default {
  "name": "eCredits Testnet",
  "chain": "ECS",
  "rpc": [
    "https://ecredits-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tst.ecredits.com"
  ],
  "faucets": [
    "https://faucet.tst.ecredits.com"
  ],
  "nativeCurrency": {
    "name": "eCredits",
    "symbol": "ECS",
    "decimals": 18
  },
  "infoURL": "https://ecredits.com",
  "shortName": "ecs-testnet",
  "chainId": 63001,
  "networkId": 63001,
  "icon": {
    "url": "ipfs://QmU9H9JE1KtLh2Fxrd8EWTMjKGJBpgRWKUeEx7u6ic4kBY",
    "width": 32,
    "height": 32,
    "format": "png"
  },
  "explorers": [
    {
      "name": "eCredits TestNet Explorer",
      "url": "https://explorer.tst.ecredits.com",
      "icon": "ecredits",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ecredits-testnet"
} as const;