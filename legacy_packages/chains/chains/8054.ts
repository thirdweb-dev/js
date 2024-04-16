import type { Chain } from "../src/types";
export default {
  "chain": "Karak",
  "chainId": 8054,
  "explorers": [
    {
      "name": "Karak Sepolia Explorer",
      "url": "https://explorer.sepolia.karak.network",
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
  "name": "Karak Sepolia",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 8054,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "rpc": [
    "https://8054.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.sepolia.karak.network"
  ],
  "shortName": "karak-sepolia",
  "slug": "karak-sepolia",
  "testnet": true,
  "title": "Karak Testnet Sepolia"
} as const satisfies Chain;