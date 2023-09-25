import type { Chain } from "../src/types";
export default {
  "chainId": 117,
  "chain": "Uptick",
  "name": "Uptick Mainnet",
  "rpc": [
    "https://uptick.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.uptick.network"
  ],
  "slug": "uptick",
  "icon": {
    "url": "ipfs://QmRGJ6PqYHDTWuUQ6xfnK8S82NzRXiMjTnSGat9qtLuaLP",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Uptick",
    "symbol": "UPTICK",
    "decimals": 18
  },
  "infoURL": "https://www.uptick.network",
  "shortName": "auptick",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Uptick Explorer",
      "url": "https://evm-explorer.uptick.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;