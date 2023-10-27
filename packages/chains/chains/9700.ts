import type { Chain } from "../src/types";
export default {
  "chain": "MainnetDev",
  "chainId": 9700,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZ1jbxFZcuotj3eZ6iKFrg9ZXnaV8AK6sGRa7ELrceWyD",
    "width": 1043,
    "height": 1079,
    "format": "png"
  },
  "infoURL": "https://oortech.com",
  "name": "Oort MainnetDev",
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "CCN",
    "decimals": 18
  },
  "networkId": 9700,
  "rpc": [],
  "shortName": "MainnetDev",
  "slug": "oort-dev",
  "testnet": false,
  "title": "Oort MainnetDev"
} as const satisfies Chain;