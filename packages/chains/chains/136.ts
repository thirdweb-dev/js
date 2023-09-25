import type { Chain } from "../src/types";
export default {
  "chainId": 136,
  "chain": "Deamchain",
  "name": "Deamchain Mainnet",
  "rpc": [
    "https://deamchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.deamchain.com"
  ],
  "slug": "deamchain",
  "icon": {
    "url": "ipfs://QmXvHWmjfXKdZMSz7x82NR4SjEqigKdJELVHbnzUPkj17F",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Deamchain Native Token",
    "symbol": "DEAM",
    "decimals": 18
  },
  "infoURL": "https://deamchain.com",
  "shortName": "deam",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Deamchain Block Explorer",
      "url": "https://scan.deamchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;