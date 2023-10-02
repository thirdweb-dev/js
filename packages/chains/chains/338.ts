import type { Chain } from "../src/types";
export default {
  "chain": "CRO",
  "chainId": 338,
  "explorers": [
    {
      "name": "Cronos Testnet Explorer",
      "url": "https://explorer.cronos.org/testnet",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://cronos.org/faucet"
  ],
  "features": [],
  "infoURL": "https://cronos.org",
  "name": "Cronos Testnet",
  "nativeCurrency": {
    "name": "Cronos Test Coin",
    "symbol": "TCRO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://cronos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-t3.cronos.org"
  ],
  "shortName": "tcro",
  "slug": "cronos-testnet",
  "testnet": true
} as const satisfies Chain;