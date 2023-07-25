import type { Chain } from "../src/types";
export default {
  "name": "Origin Testnet",
  "chain": "Origin",
  "rpc": [
    "https://origin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.origin.uptick.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Origin",
    "symbol": "UOC",
    "decimals": 18
  },
  "infoURL": "https://www.uptick.network",
  "shortName": "auoc",
  "chainId": 1170,
  "networkId": 1170,
  "icon": {
    "url": "ipfs://QmRGJ6PqYHDTWuUQ6xfnK8S82NzRXiMjTnSGat9qtLuaLP",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Origin Explorer",
      "url": "https://evm-explorer.origin.uptick.network",
      "icon": {
        "url": "ipfs://QmRGJ6PqYHDTWuUQ6xfnK8S82NzRXiMjTnSGat9qtLuaLP",
        "width": 400,
        "height": 400,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "origin-testnet"
} as const satisfies Chain;