import type { Chain } from "../src/types";
export default {
  "chain": "ITX",
  "chainId": 1235,
  "explorers": [
    {
      "name": "ITX Mainnet Explorer (Blockscout)",
      "url": "https://explorer.itxchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://explorer.itxchain.com",
  "name": "ITX Mainnet",
  "nativeCurrency": {
    "name": "ITX",
    "symbol": "ITX",
    "decimals": 18
  },
  "networkId": 1235,
  "rpc": [
    "https://1235.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.itxchain.com"
  ],
  "shortName": "itx",
  "slug": "itx",
  "testnet": false
} as const satisfies Chain;