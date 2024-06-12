import type { Chain } from "../src/types";
export default {
  "chain": "Shibarium",
  "chainId": 109,
  "explorers": [
    {
      "name": "Shibariumscan",
      "url": "https://www.shibariumscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "https://www.shibariumscan.io/assets/configs/network_icon_dark.png",
        "width": 360,
        "height": 360,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://chewyswap.dog/images/chains/109.png",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://shibariumecosystem.com",
  "name": "Shibarium",
  "nativeCurrency": {
    "name": "BONE Shibarium",
    "symbol": "BONE",
    "decimals": 18
  },
  "networkId": 109,
  "redFlags": [],
  "rpc": [
    "https://109.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shibrpc.com",
    "https://www.shibrpc.com"
  ],
  "shortName": "shibariumecosystem",
  "slug": "shibarium",
  "testnet": false
} as const satisfies Chain;