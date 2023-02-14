export default {
  "name": "MOAC testnet",
  "chain": "MOAC",
  "rpc": [
    "https://moac-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gateway.moac.io/testnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MOAC",
    "symbol": "mc",
    "decimals": 18
  },
  "infoURL": "https://moac.io",
  "shortName": "moactest",
  "chainId": 201,
  "networkId": 201,
  "explorers": [
    {
      "name": "moac testnet explorer",
      "url": "https://testnet.moac.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "moac-testnet"
} as const;