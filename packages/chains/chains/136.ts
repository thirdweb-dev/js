import type { Chain } from "../src/types";
export default {
  "chain": "Deamchain",
  "chainId": 136,
  "explorers": [
    {
      "name": "Deamchain Block Explorer",
      "url": "https://scan.deamchain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXvHWmjfXKdZMSz7x82NR4SjEqigKdJELVHbnzUPkj17F",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXvHWmjfXKdZMSz7x82NR4SjEqigKdJELVHbnzUPkj17F",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://deamchain.com",
  "name": "Deamchain Mainnet",
  "nativeCurrency": {
    "name": "Deamchain Native Token",
    "symbol": "DEAM",
    "decimals": 18
  },
  "networkId": 136,
  "rpc": [
    "https://136.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.deamchain.com"
  ],
  "shortName": "deam",
  "slug": "deamchain",
  "testnet": false
} as const satisfies Chain;