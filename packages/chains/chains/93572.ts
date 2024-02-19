import type { Chain } from "../src/types";
export default {
  "chain": "LILA",
  "chainId": 93572,
  "explorers": [
    {
      "name": "LiquidLayer Testnet Explorer",
      "url": "https://testnet-scan.liquidlayer.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://claim.liquidlayer.network"
  ],
  "icon": {
    "url": "ipfs://bafkreiayuuzfpcgwjll4us4hquvpqa5gwq3lbiedv4qftmlwcxhcyjzzpq",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://testnet-scan.liquidlayer.network",
  "name": "LiquidLayer Testnet",
  "nativeCurrency": {
    "name": "LiquidLayer Testnet",
    "symbol": "LILA",
    "decimals": 18
  },
  "networkId": 93572,
  "rpc": [
    "https://liquidlayer-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://93572.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.liquidlayer.network"
  ],
  "shortName": "tLILA",
  "slug": "liquidlayer-testnet",
  "testnet": true
} as const satisfies Chain;