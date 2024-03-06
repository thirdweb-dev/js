import type { Chain } from "../src/types";
export default {
  "chain": "Karak",
  "chainId": 2410,
  "explorers": [
    {
      "name": "Karak Mainnet Explorer",
      "url": "https://explorer.karak.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRvHRuhfQgDRyGgt6vCoHqjZW2Dir7siowYnBpR5BRSej",
    "width": 1080,
    "height": 1080,
    "format": "png"
  },
  "infoURL": "https://karak.network",
  "name": "Karak Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2410,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [
    "https://2410.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.karak.network"
  ],
  "shortName": "karak-mainnet",
  "slug": "karak",
  "testnet": false
} as const satisfies Chain;