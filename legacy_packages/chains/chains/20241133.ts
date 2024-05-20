import type { Chain } from "../src/types";
export default {
  "chain": "SWAN",
  "chainId": 20241133,
  "explorers": [
    {
      "name": "Swan Proxima Chain explorer",
      "url": "https://proxima-explorer.swanchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://swanchain.io/",
  "name": "Swan Proxima Testnet",
  "nativeCurrency": {
    "name": "SWANETH",
    "symbol": "sETH",
    "decimals": 18
  },
  "networkId": 20241133,
  "rpc": [
    "https://20241133.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-proxima.swanchain.io"
  ],
  "shortName": "Proxima",
  "slug": "swan-proxima-testnet",
  "testnet": true
} as const satisfies Chain;