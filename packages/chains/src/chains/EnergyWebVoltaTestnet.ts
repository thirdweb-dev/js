import type { Chain } from "../types";
export default {
  "chain": "Volta",
  "chainId": 73799,
  "explorers": [],
  "faucets": [
    "https://voltafaucet.energyweb.org"
  ],
  "infoURL": "https://energyweb.org",
  "name": "Energy Web Volta Testnet",
  "nativeCurrency": {
    "name": "Volta Token",
    "symbol": "VT",
    "decimals": 18
  },
  "networkId": 73799,
  "rpc": [
    "https://energy-web-volta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://73799.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://volta-rpc.energyweb.org",
    "wss://volta-rpc.energyweb.org/ws"
  ],
  "shortName": "vt",
  "slug": "energy-web-volta-testnet",
  "testnet": true
} as const satisfies Chain;