import type { Chain } from "../src/types";
export default {
  "chainId": 3269,
  "chain": "DUBX",
  "name": "Dubxcoin network",
  "rpc": [
    "https://dubxcoin-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcmain.arabianchain.org"
  ],
  "slug": "dubxcoin-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Dubxcoin mainnet",
    "symbol": "DUBX",
    "decimals": 18
  },
  "infoURL": "https://arabianchain.org",
  "shortName": "dubx",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;