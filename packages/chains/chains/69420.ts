import type { Chain } from "../src/types";
export default {
  "chainId": 69420,
  "chain": "ETH",
  "name": "Condrieu",
  "rpc": [
    "https://condrieu.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.condrieu.ethdevops.io:8545"
  ],
  "slug": "condrieu",
  "faucets": [
    "https://faucet.condrieu.ethdevops.io"
  ],
  "nativeCurrency": {
    "name": "Condrieu Testnet Ether",
    "symbol": "CTE",
    "decimals": 18
  },
  "infoURL": "https://condrieu.ethdevops.io",
  "shortName": "cndr",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Condrieu explorer",
      "url": "https://explorer.condrieu.ethdevops.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;