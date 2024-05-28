import type { Chain } from "../src/types";
export default {
  "chain": "WON",
  "chainId": 686868,
  "explorers": [
    {
      "name": "Won Explorer",
      "url": "https://scan.wonnetwork.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.wondollars.org"
  ],
  "infoURL": "https://wonnetwork.org",
  "name": "Won Network",
  "nativeCurrency": {
    "name": "Won",
    "symbol": "WON",
    "decimals": 18
  },
  "networkId": 686868,
  "rpc": [
    "https://686868.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.wonnetwork.org"
  ],
  "shortName": "WonChain",
  "slug": "won-network",
  "testnet": false
} as const satisfies Chain;