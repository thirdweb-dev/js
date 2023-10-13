import type { Chain } from "../src/types";
export default {
  "chain": "pangoro",
  "chainId": 45,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://pangoro.subscan.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://docs.darwinia.network/pangoro-testnet-70cfec5dc9ca42759959ba3803edaec2"
  ],
  "features": [],
  "infoURL": "https://darwinia.network/",
  "name": "Darwinia Pangoro Testnet",
  "nativeCurrency": {
    "name": "Pangoro Network Native Token",
    "symbol": "ORING",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://darwinia-pangoro-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pangoro-rpc.darwinia.network"
  ],
  "shortName": "pangoro",
  "slug": "darwinia-pangoro-testnet",
  "testnet": true
} as const satisfies Chain;