import type { Chain } from "../types";
export default {
  "chain": "Oort Mainnet",
  "chainId": 970,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZ1jbxFZcuotj3eZ6iKFrg9ZXnaV8AK6sGRa7ELrceWyD",
    "width": 1043,
    "height": 1079,
    "format": "png"
  },
  "infoURL": "https://oortech.com",
  "name": "Oort Mainnet",
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "CCN",
    "decimals": 18
  },
  "networkId": 970,
  "rpc": [
    "https://oort.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://970.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.oortech.com"
  ],
  "shortName": "ccn",
  "slug": "oort",
  "testnet": false
} as const satisfies Chain;