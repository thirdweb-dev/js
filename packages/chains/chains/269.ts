import type { Chain } from "../src/types";
export default {
  "name": "High Performance Blockchain",
  "chain": "HPB",
  "rpc": [
    "https://high-performance-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hpbnode.com",
    "wss://ws.hpbnode.com"
  ],
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
  "chainId": 269,
  "networkId": 269,
  "slip44": 269,
  "explorers": [
    {
      "name": "hscan",
      "url": "https://hscan.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "high-performance-blockchain"
} as const satisfies Chain;