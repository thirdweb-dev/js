import type { Chain } from "../src/types";
export default {
  "chainId": 8217,
  "chain": "KLAY",
  "name": "Klaytn Mainnet Cypress",
  "rpc": [
    "https://klaytn-cypress.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://klaytn.blockpi.network/v1/rpc/public",
    "https://klaytn-mainnet-rpc.allthatnode.com:8551",
    "https://public-en-cypress.klaytn.net",
    "https://public-node-api.klaytnapi.com/v1/cypress"
  ],
  "slug": "klaytn-cypress",
  "icon": {
    "url": "ipfs://bafkreigtgdivlmfvf7trqjqy4vkz2d26xk3iif6av265v4klu5qavsugm4",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "KLAY",
    "symbol": "KLAY",
    "decimals": 18
  },
  "infoURL": "https://www.klaytn.com/",
  "shortName": "Cypress",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;