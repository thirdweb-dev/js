import type { Chain } from "../src/types";
export default {
  "chainId": 9700,
  "chain": "MainnetDev",
  "name": "Oort MainnetDev",
  "rpc": [],
  "slug": "oort-dev",
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
  "shortName": "MainnetDev",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;