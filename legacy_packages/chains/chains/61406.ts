import type { Chain } from "../src/types";
export default {
  "chain": "KEC",
  "chainId": 61406,
  "explorers": [
    {
      "name": "KaiChain Explorer",
      "url": "https://explorer.kaichain.net",
      "standard": "EIP3091"
    },
    {
      "name": "KEC SCAN",
      "url": "https://explorer.kaichain.net/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmbfRP2Ugo66pw6Mn8m9ChP4UE6Rn5nobtDo7Vy7ej93qA/kaichain%20icon.png",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbfRP2Ugo66pw6Mn8m9ChP4UE6Rn5nobtDo7Vy7ej93qA/kaichain%20icon.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "http://kaichain.net/",
  "name": "Kaichain Mainnet",
  "nativeCurrency": {
    "name": "Kaichain",
    "symbol": "KEC",
    "decimals": 18
  },
  "networkId": 61406,
  "redFlags": [],
  "rpc": [
    "https://61406.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.kaichain.net"
  ],
  "shortName": "Kaichain",
  "slug": "kaichain",
  "testnet": false
} as const satisfies Chain;