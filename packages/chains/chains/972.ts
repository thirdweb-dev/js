import type { Chain } from "../src/types";
export default {
  "chainId": 972,
  "chain": "Ascraeus",
  "name": "Oort Ascraeus",
  "rpc": [
    "https://oort-ascraeus.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ascraeus-rpc.oortech.com"
  ],
  "slug": "oort-ascraeus",
  "icon": {
    "url": "ipfs://QmZ1jbxFZcuotj3eZ6iKFrg9ZXnaV8AK6sGRa7ELrceWyD",
    "width": 1043,
    "height": 1079,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "CCN",
    "decimals": 18
  },
  "infoURL": "https://oortech.com",
  "shortName": "Ascraeus",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;