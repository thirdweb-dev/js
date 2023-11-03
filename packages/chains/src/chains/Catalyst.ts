import type { Chain } from "../types";
export default {
  "chain": "CFG",
  "chainId": 2032,
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
  "name": "Catalyst",
  "nativeCurrency": {
    "name": "Catalyst CFG",
    "symbol": "NCFG",
    "decimals": 18
  },
  "networkId": 2032,
  "rpc": [
    "wss://fullnode.catalyst.cntrfg.com"
  ],
  "shortName": "ncfg",
  "slug": "catalyst",
  "testnet": false
} as const satisfies Chain;