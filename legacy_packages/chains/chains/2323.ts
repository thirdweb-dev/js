import type { Chain } from "../src/types";
export default {
  "chain": "SOMA",
  "chainId": 2323,
  "explorers": [
    {
      "name": "SOMA Testnet Explorer",
      "url": "https://testnet.somascan.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.somanetwork.io"
  ],
  "infoURL": "https://somanetwork.io",
  "name": "SOMA Network Testnet",
  "nativeCurrency": {
    "name": "SMA",
    "symbol": "tSMA",
    "decimals": 18
  },
  "networkId": 2323,
  "rpc": [
    "https://2323.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-testnet-v1.somanetwork.io/",
    "https://testnet-au-server-2.somanetwork.io",
    "https://testnet-au-server-1.somanetwork.io",
    "https://testnet-sg-server-1.somanetwork.io",
    "https://testnet-sg-server-2.somanetwork.io"
  ],
  "shortName": "sma",
  "slip44": 1,
  "slug": "soma-network-testnet",
  "testnet": true
} as const satisfies Chain;