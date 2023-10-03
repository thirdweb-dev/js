import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 69420,
  "explorers": [
    {
      "name": "Condrieu explorer",
      "url": "https://explorer.condrieu.ethdevops.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.condrieu.ethdevops.io"
  ],
  "features": [],
  "infoURL": "https://condrieu.ethdevops.io",
  "name": "Condrieu",
  "nativeCurrency": {
    "name": "Condrieu Testnet Ether",
    "symbol": "CTE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://condrieu.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.condrieu.ethdevops.io:8545"
  ],
  "shortName": "cndr",
  "slug": "condrieu",
  "testnet": true
} as const satisfies Chain;