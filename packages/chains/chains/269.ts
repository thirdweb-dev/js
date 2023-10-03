import type { Chain } from "../src/types";
export default {
  "chain": "HPB",
  "chainId": 269,
  "explorers": [
    {
      "name": "hscan",
      "url": "https://hscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://myhpbwallet.com/"
  ],
  "features": [],
  "infoURL": "https://hpb.io",
  "name": "High Performance Blockchain",
  "nativeCurrency": {
    "name": "High Performance Blockchain Ether",
    "symbol": "HPB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://high-performance-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hpbnode.com",
    "wss://ws.hpbnode.com"
  ],
  "shortName": "hpb",
  "slug": "high-performance-blockchain",
  "testnet": false
} as const satisfies Chain;