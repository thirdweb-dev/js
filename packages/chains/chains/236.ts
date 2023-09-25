import type { Chain } from "../src/types";
export default {
  "chainId": 236,
  "chain": "Deamchain",
  "name": "Deamchain Testnet",
  "rpc": [
    "https://deamchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.deamchain.com"
  ],
  "slug": "deamchain-testnet",
  "icon": {
    "url": "ipfs://QmXvHWmjfXKdZMSz7x82NR4SjEqigKdJELVHbnzUPkj17F",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [
    "https://faucet.deamchain.com"
  ],
  "nativeCurrency": {
    "name": "Deamchain Native Token",
    "symbol": "DEAM",
    "decimals": 18
  },
  "infoURL": "https://deamchain.com",
  "shortName": "deamtest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Deamchain Testnet Explorer",
      "url": "https://testnet-scan.deamchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;