import type { Chain } from "../src/types";
export default {
  "chain": "Volta",
  "chainId": 73799,
  "explorers": [],
  "faucets": [
    "https://voltafaucet.energyweb.org"
  ],
  "features": [],
  "infoURL": "https://energyweb.org",
  "name": "Energy Web Volta Testnet",
  "nativeCurrency": {
    "name": "Volta Token",
    "symbol": "VT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://energy-web-volta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://volta-rpc.energyweb.org",
    "wss://volta-rpc.energyweb.org/ws"
  ],
  "shortName": "vt",
  "slug": "energy-web-volta-testnet",
  "testnet": true
} as const satisfies Chain;