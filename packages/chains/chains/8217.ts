export default {
  "name": "Klaytn Mainnet Cypress",
  "chain": "KLAY",
  "rpc": [
    "https://klaytn-cypress.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node-api.klaytnapi.com/v1/cypress"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KLAY",
    "symbol": "KLAY",
    "decimals": 18
  },
  "infoURL": "https://www.klaytn.com/",
  "shortName": "Cypress",
  "chainId": 8217,
  "networkId": 8217,
  "slip44": 8217,
  "explorers": [
    {
      "name": "Klaytnscope",
      "url": "https://scope.klaytn.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "klaytn-cypress"
} as const;