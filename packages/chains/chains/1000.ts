import type { Chain } from "../src/types";
export default {
  "chain": "GTON",
  "chainId": 1000,
  "explorers": [
    {
      "name": "GTON Network Explorer",
      "url": "https://explorer.gton.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://gton.capital",
  "name": "GTON Mainnet",
  "nativeCurrency": {
    "name": "GCD",
    "symbol": "GCD",
    "decimals": 18
  },
  "networkId": 1000,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [
    "https://1000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gton.network/"
  ],
  "shortName": "gton",
  "slug": "gton",
  "testnet": false
} as const satisfies Chain;