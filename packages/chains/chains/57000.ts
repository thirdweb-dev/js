import type { Chain } from "../src/types";
export default {
  "chain": "SYS",
  "chainId": 57000,
  "explorers": [
    {
      "name": "Rollux Testnet Explorer",
      "url": "https://rollux.tanenbaum.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://rollux.id/faucetapp"
  ],
  "features": [],
  "infoURL": "https://rollux.com",
  "name": "Rollux Testnet",
  "nativeCurrency": {
    "name": "Testnet Syscoin",
    "symbol": "tSYS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://rollux-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-tanenbaum.rollux.com",
    "https://rpc.ankr.com/rollux_testnet/${ANKR_API_KEY}",
    "wss://rpc-tanenbaum.rollux.com/wss"
  ],
  "shortName": "tsys-rollux",
  "slug": "rollux-testnet",
  "testnet": true
} as const satisfies Chain;