import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 34443,
  "explorers": [
    {
      "name": "modescout",
      "url": "https://explorer.mode.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreidi5y7afj5z4xrz7uz5rkg2mcsv2p2n4ui4g7q4k4ecdz65i2agou",
    "width": 2160,
    "height": 2160,
    "format": "png"
  },
  "infoURL": "https://docs.mode.network/",
  "name": "Mode",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 34443,
  "rpc": [
    "https://mode.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://34443.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.mode.network"
  ],
  "shortName": "mode",
  "slug": "mode",
  "testnet": false
} as const satisfies Chain;