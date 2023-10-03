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
  "icon": {
    "url": "ipfs://bafkreifqpj5jkjazvh24muc7wv4r22tihzzl75cevgecxhvojm4ls6mzpq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://gitshock.com",
  "name": "Gitshock Cartenz Testnet",
  "nativeCurrency": {
    "name": "Gitshock Cartenz",
    "symbol": "tGTFX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://gitshock-cartenz-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cartenz.works"
  ],
  "shortName": "gitshockchain",
  "slug": "gitshock-cartenz-testnet",
  "testnet": true
} as const satisfies Chain;