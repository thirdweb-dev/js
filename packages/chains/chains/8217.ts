export default {
  "name": "Klaytn Mainnet Cypress",
  "chain": "KLAY",
  "rpc": [
    "https://klaytn-cypress.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://klaytn.blockpi.network/v1/rpc/public",
    "https://klaytn-mainnet-rpc.allthatnode.com:8551",
    "https://public-en-cypress.klaytn.net",
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
      "name": "klaytnfinder",
      "url": "https://www.klaytnfinder.io/",
      "standard": "none"
    },
    {
      "name": "Klaytnscope",
      "url": "https://scope.klaytn.com",
      "standard": "none"
    }
  ],
  "icon": {
    "format": "png",
    "url": "ipfs://bafkreigtgdivlmfvf7trqjqy4vkz2d26xk3iif6av265v4klu5qavsugm4",
    "height": 1000,
    "width": 1000
  },
  "testnet": false,
  "slug": "klaytn-cypress"
} as const;