import type { Chain } from "../src/types";
export default {
  "name": "Rollux Mainnet",
  "chain": "SYS",
  "rpc": [
    "https://rollux.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rollux.com",
    "wss://rpc.rollux.com/wss"
  ],
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
  "chainId": 570,
  "networkId": 570,
  "explorers": [
    {
      "name": "Rollux Explorer",
      "url": "https://explorer.rollux.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "rollux"
} as const satisfies Chain;