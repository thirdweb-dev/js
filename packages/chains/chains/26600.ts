import type { Chain } from "../src/types";
export default {
  "chainId": 26600,
  "chain": "HTZ",
  "name": "Hertz Network Mainnet",
  "rpc": [
    "https://hertz-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.hertzscan.com"
  ],
  "slug": "hertz-network",
  "icon": {
    "url": "ipfs://Qmf3GYbPXmTDpSP6t7Ug2j5HjEwrY5oGhBDP7d4TQHvGnG",
    "width": 162,
    "height": 129,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Hertz",
    "symbol": "HTZ",
    "decimals": 18
  },
  "infoURL": "https://www.hertz-network.com",
  "shortName": "HTZ",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Hertz Scan",
      "url": "https://hertzscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;