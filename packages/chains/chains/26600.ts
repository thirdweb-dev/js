import type { Chain } from "../src/types";
export default {
  "chain": "HTZ",
  "chainId": 26600,
  "explorers": [
    {
      "name": "Hertz Scan",
      "url": "https://hertzscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmf3GYbPXmTDpSP6t7Ug2j5HjEwrY5oGhBDP7d4TQHvGnG",
        "width": 162,
        "height": 129,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://Qmf3GYbPXmTDpSP6t7Ug2j5HjEwrY5oGhBDP7d4TQHvGnG",
    "width": 162,
    "height": 129,
    "format": "png"
  },
  "infoURL": "https://www.hertz-network.com",
  "name": "Hertz Network Mainnet",
  "nativeCurrency": {
    "name": "Hertz",
    "symbol": "HTZ",
    "decimals": 18
  },
  "networkId": 26600,
  "rpc": [
    "https://26600.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.hertzscan.com"
  ],
  "shortName": "HTZ",
  "slug": "hertz-network",
  "testnet": false
} as const satisfies Chain;