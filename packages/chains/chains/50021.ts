import type { Chain } from "../src/types";
export default {
  "chainId": 50021,
  "chain": "GTON Testnet",
  "name": "GTON Testnet",
  "rpc": [
    "https://gton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.gton.network/"
  ],
  "slug": "gton-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "GCD",
    "symbol": "GCD",
    "decimals": 18
  },
  "infoURL": "https://gton.capital",
  "shortName": "tgton",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "GTON Testnet Network Explorer",
      "url": "https://explorer.testnet.gton.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;