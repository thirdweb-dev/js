import type { Chain } from "../src/types";
export default {
  "chain": "LiquidLayer",
  "chainId": 25186,
  "explorers": [
    {
      "name": "LiquidLayer Mainnet Explorer",
      "url": "https://scan.liquidlayer.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreiayuuzfpcgwjll4us4hquvpqa5gwq3lbiedv4qftmlwcxhcyjzzpq",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://scan.liquidlayer.network",
  "name": "LiquidLayer Mainnet",
  "nativeCurrency": {
    "name": "LiquidLayer",
    "symbol": "LILA",
    "decimals": 18
  },
  "networkId": 25186,
  "rpc": [
    "https://liquidlayer.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://25186.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.liquidlayer.network"
  ],
  "shortName": "LILA",
  "slug": "liquidlayer",
  "testnet": false
} as const satisfies Chain;