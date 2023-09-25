import type { Chain } from "../src/types";
export default {
  "chainId": 16658437,
  "chain": "Plian",
  "name": "Plian Testnet Main",
  "rpc": [
    "https://plian-testnet-main.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.plian.io/testnet"
  ],
  "slug": "plian-testnet-main",
  "faucets": [],
  "nativeCurrency": {
    "name": "Plian Testnet Token",
    "symbol": "TPI",
    "decimals": 18
  },
  "infoURL": "https://plian.org",
  "shortName": "plian-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "piscan",
      "url": "https://testnet.plian.org/testnet",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;