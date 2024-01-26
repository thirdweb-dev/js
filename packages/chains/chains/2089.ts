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
  "networkId": 2089,
  "rpc": [
    "wss://fullnode.algol.cntrfg.com"
  ],
  "shortName": "algl",
  "slug": "algol",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;