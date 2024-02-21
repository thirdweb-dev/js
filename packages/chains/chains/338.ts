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
  "infoURL": "https://cronos.org",
  "name": "Cronos Testnet",
  "nativeCurrency": {
    "name": "Cronos Test Coin",
    "symbol": "TCRO",
    "decimals": 18
  },
  "networkId": 338,
  "rpc": [
    "https://338.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-t3.cronos.org"
  ],
  "shortName": "tcro",
  "slip44": 1,
  "slug": "cronos-testnet",
  "testnet": true
} as const satisfies Chain;