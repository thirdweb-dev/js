import type { Chain } from "../src/types";
export default {
  "chainId": 338,
  "chain": "CRO",
  "name": "Cronos Testnet",
  "rpc": [
    "https://cronos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-t3.cronos.org"
  ],
  "slug": "cronos-testnet",
  "faucets": [
    "https://cronos.org/faucet"
  ],
  "nativeCurrency": {
    "name": "Cronos Test Coin",
    "symbol": "TCRO",
    "decimals": 18
  },
  "infoURL": "https://cronos.org",
  "shortName": "tcro",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Cronos Testnet Explorer",
      "url": "https://explorer.cronos.org/testnet",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;