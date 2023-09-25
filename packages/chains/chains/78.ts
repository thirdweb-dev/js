import type { Chain } from "../src/types";
export default {
  "chainId": 78,
  "chain": "PC",
  "name": "PrimusChain mainnet",
  "rpc": [
    "https://primuschain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethnode.primusmoney.com/mainnet"
  ],
  "slug": "primuschain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Primus Ether",
    "symbol": "PETH",
    "decimals": 18
  },
  "infoURL": "https://primusmoney.com",
  "shortName": "primuschain",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;