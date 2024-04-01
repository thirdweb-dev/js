import type { Chain } from "../src/types";
export default {
  "chain": "Oort Mainnet",
  "chainId": 970,
  "explorers": [
    {
      "name": "Oort Mainnet Explorer",
      "url": "https://mainnet-scan.oortech.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://oortech.com",
  "name": "Oort Mainnet",
  "nativeCurrency": {
    "name": "Oort",
    "symbol": "OORT",
    "decimals": 18
  },
  "networkId": 970,
  "rpc": [
    "https://970.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.oortech.com"
  ],
  "shortName": "ccn",
  "slug": "oort",
  "testnet": false
} as const satisfies Chain;