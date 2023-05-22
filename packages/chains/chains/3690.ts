import type { Chain } from "../src/types";
export default {
  "name": "Bittex Mainnet",
  "chain": "BTX",
  "rpc": [
    "https://bittex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.bittexscan.info",
    "https://rpc2.bittexscan.info"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bittex",
    "symbol": "BTX",
    "decimals": 18
  },
  "infoURL": "https://bittexscan.com",
  "shortName": "btx",
  "chainId": 3690,
  "networkId": 3690,
  "explorers": [
    {
      "name": "bittexscan",
      "url": "https://bittexscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bittex"
} as const satisfies Chain;