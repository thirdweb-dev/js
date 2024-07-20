import type { Chain } from "../src/types";
export default {
  "chain": "Pivotal",
  "chainId": 16481,
  "explorers": [
    {
      "name": "Pivotal Scan",
      "url": "https://sepolia.pivotalscan.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "http://thepivotal.xyz/",
  "name": "Pivotal Sepolia",
  "nativeCurrency": {
    "name": "Pivotal Plus",
    "symbol": "PLUS",
    "decimals": 18
  },
  "networkId": 16481,
  "rpc": [
    "https://16481.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.pivotalprotocol.com"
  ],
  "shortName": "pivotal-sepolia",
  "slug": "pivotal-sepolia",
  "testnet": false
} as const satisfies Chain;