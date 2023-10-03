import type { Chain } from "../src/types";
export default {
  "chain": "SYS",
  "chainId": 570,
  "explorers": [
    {
      "name": "Rollux Explorer",
      "url": "https://explorer.rollux.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://rollux.id/faucetapp"
  ],
  "features": [],
  "infoURL": "https://rollux.com",
  "name": "Rollux Mainnet",
  "nativeCurrency": {
    "name": "Syscoin",
    "symbol": "SYS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://rollux.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rollux.com",
    "https://rollux.public-rpc.com",
    "wss://rpc.rollux.com/wss",
    "https://rpc.ankr.com/rollux/${ANKR_API_KEY}"
  ],
  "shortName": "sys-rollux",
  "slug": "rollux",
  "testnet": false
} as const satisfies Chain;