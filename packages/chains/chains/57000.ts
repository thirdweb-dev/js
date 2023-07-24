import type { Chain } from "../src/types";
export default {
  "name": "Rollux Testnet",
  "chain": "SYS",
  "rpc": [
    "https://rollux-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-tanenbaum.rollux.com",
    "https://rpc.ankr.com/rollux_testnet/${ANKR_API_KEY}",
    "wss://rpc-tanenbaum.rollux.com/wss"
  ],
  "faucets": [
    "https://rollux.id/faucetapp"
  ],
  "nativeCurrency": {
    "name": "Testnet Syscoin",
    "symbol": "TSYS",
    "decimals": 18
  },
  "infoURL": "https://rollux.com",
  "shortName": "tsys-rollux",
  "chainId": 57000,
  "networkId": 57000,
  "explorers": [
    {
      "name": "Rollux Testnet Explorer",
      "url": "https://rollux.tanenbaum.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "rollux-testnet"
} as const satisfies Chain;