import type { Chain } from "../src/types";
export default {
  "chain": "ZEDXION",
  "chainId": 83872,
  "explorers": [
    {
      "name": "Zedscan",
      "url": "http://zedscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://docs.zedscan.net",
  "name": "ZEDXION",
  "nativeCurrency": {
    "name": "Zedxion",
    "symbol": "zedx",
    "decimals": 9
  },
  "networkId": 83872,
  "rpc": [
    "https://83872.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.zedscan.net"
  ],
  "shortName": "ZEDX",
  "slug": "zedxion",
  "testnet": false
} as const satisfies Chain;