import type { Chain } from "../src/types";
export default {
  "chain": "Origin",
  "chainId": 1170,
  "explorers": [
    {
      "name": "Origin Explorer",
      "url": "https://evm-explorer.origin.uptick.network",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmRGJ6PqYHDTWuUQ6xfnK8S82NzRXiMjTnSGat9qtLuaLP",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRGJ6PqYHDTWuUQ6xfnK8S82NzRXiMjTnSGat9qtLuaLP",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://www.uptick.network",
  "name": "Origin Testnet",
  "nativeCurrency": {
    "name": "Origin",
    "symbol": "UOC",
    "decimals": 18
  },
  "networkId": 1170,
  "rpc": [
    "https://1170.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.origin.uptick.network"
  ],
  "shortName": "auoc",
  "slip44": 1,
  "slug": "origin-testnet",
  "testnet": true
} as const satisfies Chain;