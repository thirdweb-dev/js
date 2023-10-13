import type { Chain } from "../src/types";
export default {
  "chain": "algol",
  "chainId": 2089,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://centrifuge.io",
  "name": "Algol",
  "nativeCurrency": {
    "name": "Algol",
    "symbol": "ALGL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://algol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fullnode.algol.cntrfg.com"
  ],
  "shortName": "algl",
  "slug": "algol",
  "testnet": false
} as const satisfies Chain;