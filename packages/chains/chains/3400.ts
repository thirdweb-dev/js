import type { Chain } from "../src/types";
export default {
  "chainId": 3400,
  "chain": "PRB",
  "name": "Paribu Net Mainnet",
  "rpc": [
    "https://paribu-net.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.paribu.network"
  ],
  "slug": "paribu-net",
  "icon": {
    "url": "ipfs://QmVgc77jYo2zrxQjhYwT4KzvSrSZ1DBJraJVX57xAvP8MD",
    "width": 2362,
    "height": 2362,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "PRB",
    "symbol": "PRB",
    "decimals": 18
  },
  "infoURL": "https://net.paribu.com",
  "shortName": "prb",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Paribu Net Explorer",
      "url": "https://explorer.paribu.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;