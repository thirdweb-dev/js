import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 9789,
  "explorers": [
    {
      "name": "Tabi Testnet Explorer",
      "url": "https://testnet.tabiscan.com/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Tabichain",
  "nativeCurrency": {
    "name": "TABI",
    "symbol": "TABI",
    "decimals": 18
  },
  "networkId": 9789,
  "redFlags": [],
  "rpc": [],
  "shortName": "tabichain",
  "slug": "tabichain",
  "testnet": true
} as const satisfies Chain;