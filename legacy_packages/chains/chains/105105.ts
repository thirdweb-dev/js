import type { Chain } from "../src/types";
export default {
  "chain": "Stratis",
  "chainId": 105105,
  "explorers": [
    {
      "name": "Stratis Explorer",
      "url": "https://explorer.stratisevm.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWiRBqfzoZ3GC7oCbYFqbwLyF4uDHM4eYdKUUJ7LHf2EA",
    "width": 59,
    "height": 55,
    "format": "svg"
  },
  "infoURL": "https://www.stratisplatform.com",
  "name": "Stratis Mainnet",
  "nativeCurrency": {
    "name": "Stratis",
    "symbol": "STRAX",
    "decimals": 18
  },
  "networkId": 105105,
  "rpc": [
    "https://105105.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.stratisevm.com"
  ],
  "shortName": "stratis",
  "slug": "stratis",
  "testnet": false
} as const satisfies Chain;