import type { Chain } from "../src/types";
export default {
  "chainId": 2032,
  "chain": "CFG",
  "name": "Catalyst",
  "rpc": [
    "https://catalyst.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fullnode.catalyst.cntrfg.com"
  ],
  "slug": "catalyst",
  "faucets": [],
  "nativeCurrency": {
    "name": "Catalyst CFG",
    "symbol": "NCFG",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "shortName": "ncfg",
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