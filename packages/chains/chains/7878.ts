import type { Chain } from "../src/types";
export default {
  "name": "Hazlor Testnet",
  "chain": "SCAS",
  "rpc": [],
  "faucets": [
    "https://faucet.hazlor.com"
  ],
  "nativeCurrency": {
    "name": "Hazlor Test Coin",
    "symbol": "TSCAS",
    "decimals": 18
  },
  "infoURL": "https://hazlor.com",
  "shortName": "tscas",
  "chainId": 7878,
  "networkId": 7878,
  "explorers": [
    {
      "name": "Hazlor Testnet Explorer",
      "url": "https://explorer.hazlor.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "hazlor-testnet"
} as const satisfies Chain;