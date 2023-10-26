import type { Chain } from "../src/types";
export default {
  "chain": "Uptick",
  "chainId": 117,
  "explorers": [
    {
      "name": "Uptick Explorer",
      "url": "https://evm-explorer.uptick.network",
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
  "name": "Uptick Mainnet",
  "nativeCurrency": {
    "name": "Uptick",
    "symbol": "UPTICK",
    "decimals": 18
  },
  "networkId": 117,
  "rpc": [
    "https://uptick.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://117.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.uptick.network"
  ],
  "shortName": "auptick",
  "slug": "uptick",
  "testnet": false
} as const satisfies Chain;