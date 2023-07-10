import type { Chain } from "../src/types";
export default {
  "name": "Deamchain Testnet",
  "chain": "Deamchain",
  "icon": {
    "url": "ipfs://QmXvHWmjfXKdZMSz7x82NR4SjEqigKdJELVHbnzUPkj17F",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "rpc": [
    "https://deamchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.deamchain.com"
  ],
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
  "chainId": 236,
  "networkId": 236,
  "explorers": [
    {
      "name": "Deamchain Testnet Explorer",
      "url": "https://testnet-scan.deamchain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXvHWmjfXKdZMSz7x82NR4SjEqigKdJELVHbnzUPkj17F",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "testnet": true,
  "slug": "deamchain-testnet"
} as const satisfies Chain;