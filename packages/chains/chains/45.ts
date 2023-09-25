import type { Chain } from "../src/types";
export default {
  "chainId": 45,
  "chain": "pangoro",
  "name": "Darwinia Pangoro Testnet",
  "rpc": [
    "https://darwinia-pangoro-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pangoro-rpc.darwinia.network"
  ],
  "slug": "darwinia-pangoro-testnet",
  "faucets": [
    "https://docs.darwinia.network/pangoro-testnet-70cfec5dc9ca42759959ba3803edaec2"
  ],
  "nativeCurrency": {
    "name": "Pangoro Network Native Token",
    "symbol": "ORING",
    "decimals": 18
  },
  "infoURL": "https://darwinia.network/",
  "shortName": "pangoro",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "subscan",
      "url": "https://pangoro.subscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;