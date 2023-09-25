import type { Chain } from "../src/types";
export default {
  "chainId": 570,
  "chain": "SYS",
  "name": "Rollux Mainnet",
  "rpc": [
    "https://rollux.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rollux.com",
    "https://rollux.public-rpc.com",
    "wss://rpc.rollux.com/wss",
    "https://rpc.ankr.com/rollux/${ANKR_API_KEY}"
  ],
  "slug": "rollux",
  "faucets": [
    "https://rollux.id/faucetapp"
  ],
  "nativeCurrency": {
    "name": "Syscoin",
    "symbol": "SYS",
    "decimals": 18
  },
  "infoURL": "https://rollux.com",
  "shortName": "sys-rollux",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Rollux Explorer",
      "url": "https://explorer.rollux.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;