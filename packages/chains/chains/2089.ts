import type { Chain } from "../src/types";
export default {
  "chainId": 2089,
  "chain": "algol",
  "name": "Algol",
  "rpc": [
    "https://algol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fullnode.algol.cntrfg.com"
  ],
  "slug": "algol",
  "faucets": [],
  "nativeCurrency": {
    "name": "Algol",
    "symbol": "ALGL",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "shortName": "algl",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;