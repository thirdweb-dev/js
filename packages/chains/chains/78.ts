import type { Chain } from "../src/types";
export default {
  "chain": "PC",
  "chainId": 78,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://primusmoney.com",
  "name": "PrimusChain mainnet",
  "nativeCurrency": {
    "name": "Primus Ether",
    "symbol": "PETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://primuschain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethnode.primusmoney.com/mainnet"
  ],
  "shortName": "primuschain",
  "slug": "primuschain",
  "testnet": false
} as const satisfies Chain;