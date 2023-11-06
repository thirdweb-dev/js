import type { Chain } from "../src/types";
export default {
  "chain": "DUBX",
  "chainId": 3269,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://arabianchain.org",
  "name": "Dubxcoin network",
  "nativeCurrency": {
    "name": "Dubxcoin mainnet",
    "symbol": "DUBX",
    "decimals": 18
  },
  "networkId": 3269,
  "rpc": [
    "https://dubxcoin-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3269.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcmain.arabianchain.org"
  ],
  "shortName": "dubx",
  "slug": "dubxcoin-network",
  "testnet": false
} as const satisfies Chain;