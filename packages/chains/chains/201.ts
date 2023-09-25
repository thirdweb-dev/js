import type { Chain } from "../src/types";
export default {
  "chainId": 201,
  "chain": "MOAC",
  "name": "MOAC testnet",
  "rpc": [
    "https://moac-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gateway.moac.io/testnet"
  ],
  "slug": "moac-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "MOAC",
    "symbol": "mc",
    "decimals": 18
  },
  "infoURL": "https://moac.io",
  "shortName": "moactest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "moac testnet explorer",
      "url": "https://testnet.moac.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;