import type { Chain } from "../src/types";
export default {
  "chain": "MainnetDev",
  "chainId": 9700,
  "explorers": [
    {
      "name": "Oort MainnetDev Scan",
      "url": "https://dev-scan.oortech.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreidrbvklkb52sgmg7cmy42fhf7vqpig7qj7bnrq24ijdwywkzr2tfy",
        "width": 1440,
        "height": 1440,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreidrbvklkb52sgmg7cmy42fhf7vqpig7qj7bnrq24ijdwywkzr2tfy",
    "width": 1440,
    "height": 1440,
    "format": "png"
  },
  "infoURL": "https://oortech.com",
  "name": "Oort MainnetDev",
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "OORT",
    "decimals": 18
  },
  "networkId": 9700,
  "rpc": [
    "https://9700.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dev-rpc.oortech.com"
  ],
  "shortName": "MainnetDev",
  "slug": "oort-dev",
  "testnet": false,
  "title": "Oort MainnetDev"
} as const satisfies Chain;