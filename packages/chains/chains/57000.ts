import type { Chain } from "../src/types";
export default {
  "chainId": 57000,
  "chain": "SYS",
  "name": "Rollux Testnet",
  "rpc": [
    "https://rollux-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-tanenbaum.rollux.com",
    "https://rpc.ankr.com/rollux_testnet/${ANKR_API_KEY}",
    "wss://rpc-tanenbaum.rollux.com/wss"
  ],
  "slug": "rollux-testnet",
  "faucets": [
    "https://rollux.id/faucetapp"
  ],
  "nativeCurrency": {
    "name": "Testnet Syscoin",
    "symbol": "tSYS",
    "decimals": 18
  },
  "infoURL": "https://rollux.com",
  "shortName": "tsys-rollux",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Rollux Testnet Explorer",
      "url": "https://rollux.tanenbaum.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;