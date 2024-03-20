import type { Chain } from "../src/types";
export default {
  "chain": "PRB",
  "chainId": 3400,
  "explorers": [
    {
      "name": "Paribu Net Explorer",
      "url": "https://explorer.paribu.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVgc77jYo2zrxQjhYwT4KzvSrSZ1DBJraJVX57xAvP8MD",
    "width": 2362,
    "height": 2362,
    "format": "png"
  },
  "infoURL": "https://net.paribu.com",
  "name": "Paribu Net Mainnet",
  "nativeCurrency": {
    "name": "PRB",
    "symbol": "PRB",
    "decimals": 18
  },
  "networkId": 3400,
  "rpc": [
    "https://3400.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.paribu.network"
  ],
  "shortName": "prb",
  "slug": "paribu-net",
  "testnet": false
} as const satisfies Chain;