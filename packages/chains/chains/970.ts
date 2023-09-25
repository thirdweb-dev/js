import type { Chain } from "../src/types";
export default {
  "chainId": 970,
  "chain": "Oort Mainnet",
  "name": "Oort Mainnet",
  "rpc": [
    "https://oort.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.oortech.com"
  ],
  "slug": "oort",
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
  "shortName": "ccn",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;