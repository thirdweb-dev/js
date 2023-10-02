import type { Chain } from "../src/types";
export default {
  "name": "Dubxcoin network",
  "chain": "DUBX",
  "rpc": [
    "https://dubxcoin-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcmain.arabianchain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Dubxcoin mainnet",
    "symbol": "DUBX",
    "decimals": 18
  },
  "infoURL": "https://arabianchain.org",
  "shortName": "dubx",
  "chainId": 3269,
  "networkId": 3269,
  "testnet": false,
  "slug": "dubxcoin-network"
} as const satisfies Chain;