import type { Chain } from "../src/types";
export default {
  "chain": "KLAY",
  "chainId": 8217,
  "explorers": [
    {
      "name": "Klaytnscope",
      "url": "https://scope.klaytn.com",
      "standard": "EIP3091"
    },
    {
      "name": "Klaytnfinder",
      "url": "https://klaytnfinder.io",
      "standard": "EIP3091"
    },
    {
      "name": "klaytnfinder",
      "url": "https://www.klaytnfinder.io/",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreigtgdivlmfvf7trqjqy4vkz2d26xk3iif6av265v4klu5qavsugm4",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://klaytn.foundation",
  "name": "Klaytn Mainnet Cypress",
  "nativeCurrency": {
    "name": "KLAY",
    "symbol": "KLAY",
    "decimals": 18
  },
  "networkId": 8217,
  "redFlags": [],
  "rpc": [
    "https://8217.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-en-cypress.klaytn.net",
    "https://klaytn-mainnet-rpc.allthatnode.com:8551",
    "https://klaytn.blockpi.network/v1/rpc/public"
  ],
  "shortName": "Cypress",
  "slip44": 8217,
  "slug": "klaytn-cypress",
  "testnet": false
} as const satisfies Chain;