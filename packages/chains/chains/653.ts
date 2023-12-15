import type { Chain } from "../src/types";
export default {
  "chain": "Kalichain",
  "chainId": 653,
  "explorers": [
    {
      "name": "kalichain explorer",
      "url": "https://explorer.kalichain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://kalichain.com",
  "name": "Kalichain Mainnet",
  "nativeCurrency": {
    "name": "kalis",
    "symbol": "KALIS",
    "decimals": 18
  },
  "networkId": 653,
  "rpc": [
    "https://kalichain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://653.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kalichain.com"
  ],
  "shortName": "kalichain",
  "slug": "kalichain",
  "testnet": false
} as const satisfies Chain;