import type { Chain } from "../src/types";
export default {
  "chain": "ModeTest",
  "chainId": 919,
  "explorers": [
    {
      "name": "mode-sepolia-vtnhnpim72",
      "url": "https://sepolia.explorer.mode.network/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreidi5y7afj5z4xrz7uz5rkg2mcsv2p2n4ui4g7q4k4ecdz65i2agou",
    "width": 2160,
    "height": 2160,
    "format": "png"
  },
  "name": "Mode Testnet ",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://mode-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.mode.network/"
  ],
  "shortName": "ModeTest",
  "slug": "mode-testnet",
  "testnet": true
} as const satisfies Chain;