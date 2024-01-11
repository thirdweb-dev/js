import type { Chain } from "../src/types";
export default {
  "chain": "Ascraeus",
  "chainId": 972,
  "explorers": [
    {
      "name": "Oort Ascraeus Explorer",
      "url": "https://ascraeus-scan.oortech.com",
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
  "name": "Oort Ascraeus",
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "CCNA",
    "decimals": 18
  },
  "networkId": 972,
  "rpc": [
    "https://oort-ascraeus.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://972.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ascraeus-rpc.oortech.com"
  ],
  "shortName": "Ascraeus",
  "slug": "oort-ascraeus",
  "testnet": false,
  "title": "Oort Ascraeus"
} as const satisfies Chain;