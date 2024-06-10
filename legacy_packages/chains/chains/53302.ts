import type { Chain } from "../src/types";
export default {
  "chain": "Superseed",
  "chainId": 53302,
  "explorers": [
    {
      "name": "Sepolia Superseed explorer",
      "url": "https://sepolia-explorer.superseed.xyz",
      "standard": "EIP155",
      "icon": {
        "url": "ipfs://QmQcN2z3QZzG4tUD4k5Pg1otHpKhU4s3oeCpZKLwj8iWfo",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQcN2z3QZzG4tUD4k5Pg1otHpKhU4s3oeCpZKLwj8iWfo",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "name": "Superseed",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 53302,
  "redFlags": [],
  "rpc": [
    "https://53302.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.superseed.xyz"
  ],
  "shortName": "Superseed",
  "slug": "superseed",
  "testnet": true
} as const satisfies Chain;