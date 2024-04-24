import type { Chain } from "../src/types";
export default {
  "chain": "PepeNetwork",
  "chainId": 9779,
  "explorers": [
    {
      "name": "Pepe Explorer",
      "url": "https://explorer.pepenetwork.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://pepenetwork.io",
  "name": "PepeNetwork Mainnet",
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "WPEPE",
    "decimals": 18
  },
  "networkId": 9779,
  "rpc": [
    "https://9779.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.pepenetwork.io"
  ],
  "shortName": "pn",
  "slug": "pepenetwork",
  "testnet": false
} as const satisfies Chain;