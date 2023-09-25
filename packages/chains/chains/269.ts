import type { Chain } from "../src/types";
export default {
  "chainId": 269,
  "chain": "HPB",
  "name": "High Performance Blockchain",
  "rpc": [
    "https://high-performance-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hpbnode.com",
    "wss://ws.hpbnode.com"
  ],
  "slug": "high-performance-blockchain",
  "faucets": [
    "https://myhpbwallet.com/"
  ],
  "nativeCurrency": {
    "name": "High Performance Blockchain Ether",
    "symbol": "HPB",
    "decimals": 18
  },
  "infoURL": "https://hpb.io",
  "shortName": "hpb",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "hscan",
      "url": "https://hscan.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;