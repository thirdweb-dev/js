import type { Chain } from "../src/types";
export default {
  "chain": "inEVM",
  "chainId": 2525,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://inevm.com",
  "name": "inEVM Mainnet",
  "nativeCurrency": {
    "name": "Injective",
    "symbol": "INJ",
    "decimals": 18
  },
  "networkId": 2525,
  "rpc": [
    "https://2525.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rpc.inevm.com/http"
  ],
  "shortName": "inevm",
  "slug": "inevm",
  "status": "active",
  "testnet": false
} as const satisfies Chain;