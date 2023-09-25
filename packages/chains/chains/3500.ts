import type { Chain } from "../src/types";
export default {
  "chainId": 3500,
  "chain": "PRB",
  "name": "Paribu Net Testnet",
  "rpc": [
    "https://paribu-net-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.paribuscan.com"
  ],
  "slug": "paribu-net-testnet",
  "icon": {
    "url": "ipfs://QmVgc77jYo2zrxQjhYwT4KzvSrSZ1DBJraJVX57xAvP8MD",
    "width": 2362,
    "height": 2362,
    "format": "png"
  },
  "faucets": [
    "https://faucet.paribuscan.com"
  ],
  "nativeCurrency": {
    "name": "PRB",
    "symbol": "PRB",
    "decimals": 18
  },
  "infoURL": "https://net.paribu.com",
  "shortName": "prbtestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Paribu Net Testnet Explorer",
      "url": "https://testnet.paribuscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;