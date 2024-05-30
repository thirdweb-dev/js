import type { Chain } from "../src/types";
export default {
  "chain": "Elizabeth",
  "chainId": 2731,
  "explorers": [
    {
      "name": "Time Network Explorer",
      "url": "https://testnet-scanner.timenetwork.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreidoudwo453gr3hoxpreleguga73rm55yl6vuedxrfmhknljppqbiu",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreidoudwo453gr3hoxpreleguga73rm55yl6vuedxrfmhknljppqbiu",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://whitepaper.anttime.net/overview/anttime",
  "name": "Elizabeth Testnet",
  "nativeCurrency": {
    "name": "TIME",
    "symbol": "TIME",
    "decimals": 18
  },
  "networkId": 2731,
  "rpc": [
    "https://2731.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.timenetwork.io"
  ],
  "shortName": "TIME",
  "slug": "elizabeth-testnet",
  "testnet": true
} as const satisfies Chain;