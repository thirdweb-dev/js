import type { Chain } from "../src/types";
export default {
  "chain": "BRNKC",
  "chainId": 641230,
  "explorers": [
    {
      "name": "brnkscan",
      "url": "https://brnkscan.bearnetwork.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://bearnetwork.net",
  "name": "Bear Network Chain Mainnet",
  "nativeCurrency": {
    "name": "Bear Network Chain Native Token",
    "symbol": "BRNKC",
    "decimals": 18
  },
  "networkId": 641230,
  "rpc": [
    "https://641230.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://brnkc-mainnet.bearnetwork.net",
    "https://brnkc-mainnet1.bearnetwork.net"
  ],
  "shortName": "BRNKC",
  "slug": "bear-network-chain",
  "testnet": false
} as const satisfies Chain;