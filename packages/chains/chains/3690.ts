import type { Chain } from "../src/types";
export default {
  "chain": "BTX",
  "chainId": 3690,
  "explorers": [
    {
      "name": "bittexscan",
      "url": "https://bittexscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://bittexscan.com",
  "name": "Bittex Mainnet",
  "nativeCurrency": {
    "name": "Bittex",
    "symbol": "BTX",
    "decimals": 18
  },
  "networkId": 3690,
  "rpc": [
    "https://bittex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3690.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.bittexscan.info",
    "https://rpc2.bittexscan.info"
  ],
  "shortName": "btx",
  "slug": "bittex",
  "testnet": false
} as const satisfies Chain;