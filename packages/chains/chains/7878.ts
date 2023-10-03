import type { Chain } from "../src/types";
export default {
  "chain": "SCAS",
  "chainId": 7878,
  "explorers": [
    {
      "name": "Hazlor Testnet Explorer",
      "url": "https://explorer.hazlor.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.hazlor.com"
  ],
  "features": [],
  "infoURL": "https://hazlor.com",
  "name": "Hazlor Testnet",
  "nativeCurrency": {
    "name": "Hazlor Test Coin",
    "symbol": "TSCAS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://hazlor-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hatlas.rpc.hazlor.com:8545",
    "wss://hatlas.rpc.hazlor.com:8546"
  ],
  "shortName": "tscas",
  "slug": "hazlor-testnet",
  "testnet": true
} as const satisfies Chain;