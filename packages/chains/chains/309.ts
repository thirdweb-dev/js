import type { Chain } from "../src/types";
export default {
  "chainId": 309,
  "chain": "WYZ",
  "name": "Wyzth Testnet",
  "rpc": [
    "https://wyzth-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet3.wyzthchain.org/"
  ],
  "slug": "wyzth-testnet",
  "icon": {
    "url": "ipfs://QmeDfLgA5heAAXsU8kf5J23Y8up4uHN27uRBEAJFPMJEu7",
    "width": 48,
    "height": 48,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Wyzth",
    "symbol": "WYZ",
    "decimals": 18
  },
  "infoURL": "https://wyzth.org/",
  "shortName": "wyz",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "wyzth",
      "url": "http://24.199.108.65:4000",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;