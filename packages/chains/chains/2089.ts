import type { Chain } from "../src/types";
export default {
  "name": "Algol",
  "chain": "algol",
  "rpc": [
    "wss://fullnode.algol.cntrfg.com"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Algol",
    "symbol": "ALGL",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "shortName": "algl",
  "chainId": 2089,
  "networkId": 2089,
  "testnet": false,
  "slug": "algol"
} as const satisfies Chain;