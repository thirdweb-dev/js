import type { Chain } from "../src/types";
export default {
  "chainId": 919,
  "chain": "ModeTest",
  "name": "Mode Testnet ",
  "rpc": [
    "https://mode-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.mode.network/"
  ],
  "slug": "mode-testnet",
  "icon": {
    "url": "ipfs://bafkreidi5y7afj5z4xrz7uz5rkg2mcsv2p2n4ui4g7q4k4ecdz65i2agou",
    "width": 2160,
    "height": 2160,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": null,
  "shortName": "ModeTest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "mode-sepolia-vtnhnpim72",
      "url": "https://sepolia.explorer.mode.network/",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;