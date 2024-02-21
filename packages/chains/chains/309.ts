import type { Chain } from "../src/types";
export default {
  "chain": "WYZ",
  "chainId": 309,
  "explorers": [
    {
      "name": "wyzth",
      "url": "http://24.199.108.65:4000",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmT5UMzAftM4mHCtk4pWX4sqyJCki88APbqECywrhJp91Q",
        "width": 324,
        "height": 82,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmeDfLgA5heAAXsU8kf5J23Y8up4uHN27uRBEAJFPMJEu7",
    "width": 48,
    "height": 48,
    "format": "png"
  },
  "infoURL": "https://wyzth.org/",
  "name": "Wyzth Testnet",
  "nativeCurrency": {
    "name": "Wyzth",
    "symbol": "WYZ",
    "decimals": 18
  },
  "networkId": 309,
  "rpc": [
    "https://309.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet3.wyzthchain.org/"
  ],
  "shortName": "wyz",
  "slip44": 1,
  "slug": "wyzth-testnet",
  "testnet": true
} as const satisfies Chain;