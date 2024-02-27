import type { Chain } from "../src/types";
export default {
  "chain": "PC",
  "chainId": 78,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://primusmoney.com",
  "name": "PrimusChain mainnet",
  "nativeCurrency": {
    "name": "Primus Ether",
    "symbol": "PETH",
    "decimals": 18
  },
  "networkId": 78,
  "rpc": [
    "https://78.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethnode.primusmoney.com/mainnet"
  ],
  "shortName": "primuschain",
  "slug": "primuschain",
  "testnet": false
} as const satisfies Chain;