import type { Chain } from "../src/types";
export default {
  "chain": "MOAC",
  "chainId": 201,
  "explorers": [
    {
      "name": "moac testnet explorer",
      "url": "https://testnet.moac.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://moac.io",
  "name": "MOAC testnet",
  "nativeCurrency": {
    "name": "MOAC",
    "symbol": "mc",
    "decimals": 18
  },
  "networkId": 201,
  "rpc": [
    "https://moac-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://201.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gateway.moac.io/testnet"
  ],
  "shortName": "moactest",
  "slug": "moac-testnet",
  "testnet": true
} as const satisfies Chain;