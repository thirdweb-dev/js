import type { Chain } from "../src/types";
export default {
  "chain": "Pivotal",
  "chainId": 1648,
  "explorers": [
    {
      "name": "Pivotal Scan",
      "url": "https://pivotalscan.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "http://thepivotal.xyz/",
  "name": "Pivotal Mainnet",
  "nativeCurrency": {
    "name": "Pivotal Plus",
    "symbol": "PLUS",
    "decimals": 18
  },
  "networkId": 1648,
  "rpc": [
    "https://1648.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.pivotalprotocol.com"
  ],
  "shortName": "pivotal-mainnet",
  "slug": "pivotal",
  "testnet": false
} as const satisfies Chain;