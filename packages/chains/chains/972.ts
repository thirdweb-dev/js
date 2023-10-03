import type { Chain } from "../src/types";
export default {
  "chain": "Ascraeus",
  "chainId": 972,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZ1jbxFZcuotj3eZ6iKFrg9ZXnaV8AK6sGRa7ELrceWyD",
    "width": 1043,
    "height": 1079,
    "format": "png"
  },
  "infoURL": "https://oortech.com",
  "name": "Oort Ascraeus",
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "CCN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://oort-ascraeus.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ascraeus-rpc.oortech.com"
  ],
  "shortName": "Ascraeus",
  "slug": "oort-ascraeus",
  "testnet": false
} as const satisfies Chain;