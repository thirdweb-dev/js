import type { Chain } from "../src/types";
export default {
  "name": "Uptick Mainnet",
  "chain": "Uptick",
  "rpc": [
    "https://uptick.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.uptick.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Uptick",
    "symbol": "UPTICK",
    "decimals": 18
  },
  "infoURL": "https://www.uptick.network",
  "shortName": "auptick",
  "chainId": 117,
  "networkId": 117,
  "icon": "uptick",
  "explorers": [
    {
      "name": "Uptick Explorer",
      "url": "https://evm-explorer.uptick.network",
      "icon": "uptick",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "uptick"
} as const satisfies Chain;