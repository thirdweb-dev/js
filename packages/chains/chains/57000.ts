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
  "infoURL": "https://rollux.com",
  "name": "Rollux Testnet",
  "nativeCurrency": {
    "name": "Testnet Syscoin",
    "symbol": "TSYS",
    "decimals": 18
  },
  "networkId": 57000,
  "rpc": [
    "https://57000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-tanenbaum.rollux.com",
    "https://rpc.ankr.com/rollux_testnet/${ANKR_API_KEY}",
    "wss://rpc-tanenbaum.rollux.com/wss"
  ],
  "shortName": "tsys-rollux",
  "slip44": 1,
  "slug": "rollux-testnet",
  "testnet": true
} as const satisfies Chain;