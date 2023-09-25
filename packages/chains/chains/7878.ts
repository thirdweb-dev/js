import type { Chain } from "../src/types";
export default {
  "chainId": 7878,
  "chain": "SCAS",
  "name": "Hazlor Testnet",
  "rpc": [
    "https://hazlor-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hatlas.rpc.hazlor.com:8545",
    "wss://hatlas.rpc.hazlor.com:8546"
  ],
  "slug": "hazlor-testnet",
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Hazlor Testnet Explorer",
      "url": "https://explorer.hazlor.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;