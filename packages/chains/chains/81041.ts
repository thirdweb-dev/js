import type { Chain } from "../src/types";
export default {
  "chain": "Nordek",
  "chainId": 81041,
  "explorers": [
    {
      "name": "nordek",
      "url": "https://nordekscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://nordekscan.com",
  "name": "Nordek Mainnet",
  "nativeCurrency": {
    "name": "NRK",
    "symbol": "NRK",
    "decimals": 18
  },
  "networkId": 81041,
  "rpc": [
    "https://nordek.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://81041.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.nordekscan.com"
  ],
  "shortName": "nordek",
  "slug": "nordek",
  "testnet": false
} as const satisfies Chain;