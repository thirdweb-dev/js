import type { Chain } from "../src/types";
export default {
  "chainId": 1170,
  "chain": "Origin",
  "name": "Origin Testnet",
  "rpc": [
    "https://origin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.origin.uptick.network"
  ],
  "slug": "origin-testnet",
  "icon": {
    "url": "ipfs://QmRGJ6PqYHDTWuUQ6xfnK8S82NzRXiMjTnSGat9qtLuaLP",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Origin",
    "symbol": "UOC",
    "decimals": 18
  },
  "infoURL": "https://www.uptick.network",
  "shortName": "auoc",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Origin Explorer",
      "url": "https://evm-explorer.origin.uptick.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;