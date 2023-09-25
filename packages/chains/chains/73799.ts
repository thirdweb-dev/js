import type { Chain } from "../src/types";
export default {
  "chainId": 73799,
  "chain": "Volta",
  "name": "Energy Web Volta Testnet",
  "rpc": [
    "https://energy-web-volta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://volta-rpc.energyweb.org",
    "wss://volta-rpc.energyweb.org/ws"
  ],
  "slug": "energy-web-volta-testnet",
  "faucets": [
    "https://voltafaucet.energyweb.org"
  ],
  "nativeCurrency": {
    "name": "Volta Token",
    "symbol": "VT",
    "decimals": 18
  },
  "infoURL": "https://energyweb.org",
  "shortName": "vt",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;