import type { Chain } from "../types";
export default {
  "chain": "Plian",
  "chainId": 16658437,
  "explorers": [
    {
      "name": "piscan",
      "url": "https://testnet.plian.org/testnet",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://plian.org",
  "name": "Plian Testnet Main",
  "nativeCurrency": {
    "name": "Plian Testnet Token",
    "symbol": "TPI",
    "decimals": 18
  },
  "networkId": 16658437,
  "rpc": [
    "https://plian-testnet-main.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://16658437.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.plian.io/testnet"
  ],
  "shortName": "plian-testnet",
  "slug": "plian-testnet-main",
  "testnet": true
} as const satisfies Chain;