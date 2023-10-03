import type { Chain } from "../src/types";
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
  "redFlags": [],
  "rpc": [
    "https://catalyst.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fullnode.catalyst.cntrfg.com"
  ],
  "shortName": "ncfg",
  "slug": "catalyst",
  "testnet": false
} as const satisfies Chain;