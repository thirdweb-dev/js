import type { Chain } from "../src/types";
export default {
  "chainId": 1881,
  "chain": "Gitshock Cartenz",
  "name": "Gitshock Cartenz Testnet",
  "rpc": [
    "https://gitshock-cartenz-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.cartenz.works"
  ],
  "slug": "gitshock-cartenz-testnet",
  "icon": {
    "url": "ipfs://bafkreifqpj5jkjazvh24muc7wv4r22tihzzl75cevgecxhvojm4ls6mzpq",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Gitshock Cartenz",
    "symbol": "tGTFX",
    "decimals": 18
  },
  "infoURL": "https://gitshock.com",
  "shortName": "gitshockchain",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.cartenz.works",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;