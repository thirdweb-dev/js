import type { Chain } from "../src/types";
export default {
  "chain": "Gitshock Cartenz",
  "chainId": 1881,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.cartenz.works",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://gitshock.com",
  "name": "Gitshock Cartenz Testnet",
  "nativeCurrency": {
    "name": "Gitshock Cartenz",
    "symbol": "tGTFX",
    "decimals": 18
  },
  "networkId": 1881,
  "rpc": [
    "https://1881.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cartenz.works"
  ],
  "shortName": "gitshockchain",
  "slip44": 1,
  "slug": "gitshock-cartenz-testnet",
  "testnet": true
} as const satisfies Chain;