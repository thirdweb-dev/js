import type { Chain } from "../src/types";
export default {
  "chain": "GTON Testnet",
  "chainId": 50021,
  "explorers": [
    {
      "name": "GTON Testnet Network Explorer",
      "url": "https://explorer.testnet.gton.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://gton.capital",
  "name": "GTON Testnet",
  "nativeCurrency": {
    "name": "GCD",
    "symbol": "GCD",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://gton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gton.network/"
  ],
  "shortName": "tgton",
  "slug": "gton-testnet",
  "testnet": true
} as const satisfies Chain;