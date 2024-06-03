import type { Chain } from "../src/types";
export default {
  "chain": "NumBlock",
  "chainId": 5112023,
  "explorers": [
    {
      "name": "NumBlock Explorer",
      "url": "https://mainnet.numblock.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://numblock.org",
  "name": "NumBlock Chain",
  "nativeCurrency": {
    "name": "NUMB Token",
    "symbol": "NUMB",
    "decimals": 18
  },
  "networkId": 5112023,
  "rpc": [
    "https://5112023.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.numblock.org"
  ],
  "shortName": "NUMB",
  "slug": "numblock-chain",
  "testnet": false
} as const satisfies Chain;