import type { Chain } from "../src/types";
export default {
  "chain": "PRB",
  "chainId": 3500,
  "explorers": [
    {
      "name": "Paribu Net Testnet Explorer",
      "url": "https://testnet.paribuscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.paribuscan.com"
  ],
  "icon": {
    "url": "ipfs://QmVgc77jYo2zrxQjhYwT4KzvSrSZ1DBJraJVX57xAvP8MD",
    "width": 2362,
    "height": 2362,
    "format": "png"
  },
  "infoURL": "https://net.paribu.com",
  "name": "Paribu Net Testnet",
  "nativeCurrency": {
    "name": "PRB",
    "symbol": "PRB",
    "decimals": 18
  },
  "networkId": 3500,
  "rpc": [
    "https://paribu-net-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3500.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.paribuscan.com"
  ],
  "shortName": "prbtestnet",
  "slug": "paribu-net-testnet",
  "testnet": true
} as const satisfies Chain;