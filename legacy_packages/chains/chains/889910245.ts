import type { Chain } from "../src/types";
export default {
  "chain": "PTCE",
  "chainId": 889910245,
  "explorers": [
    {
      "name": "PTCESCAN Testnet Explorer",
      "url": "https://explorer-testnet.ptcscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.ptcscan.io/"
  ],
  "infoURL": "https://ptcscan.io",
  "name": "PTCESCAN Testnet",
  "nativeCurrency": {
    "name": "PTCE",
    "symbol": "PTCE",
    "decimals": 18
  },
  "networkId": 889910245,
  "rpc": [
    "https://889910245.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.ptcscan.io"
  ],
  "shortName": "PTCE",
  "slug": "ptcescan-testnet",
  "testnet": true,
  "title": "PTCESCAN Testnet"
} as const satisfies Chain;