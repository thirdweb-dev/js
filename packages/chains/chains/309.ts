import type { Chain } from "../src/types";
export default {
  "name": "Wyzth Testnet",
  "chain": "WYZ",
  "rpc": [
    "https://wyzth-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet3.wyzthchain.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Wyzth",
    "symbol": "WYZ",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://wyzth.org/",
  "shortName": "wyz",
  "chainId": 309,
  "networkId": 309,
  "icon": {
    "url": "ipfs://QmeDfLgA5heAAXsU8kf5J23Y8up4uHN27uRBEAJFPMJEu7",
    "width": 48,
    "height": 48,
    "format": "png"
  },
  "explorers": [
    {
      "name": "wyzth",
      "url": "http://24.199.108.65:4000",
      "icon": {
        "url": "ipfs://QmT5UMzAftM4mHCtk4pWX4sqyJCki88APbqECywrhJp91Q",
        "width": 324,
        "height": 82,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "wyzth-testnet"
} as const satisfies Chain;