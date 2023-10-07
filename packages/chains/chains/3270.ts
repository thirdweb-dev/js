import type { Chain } from "../src/types";
export default {
  "chain": "TESTDUBX",
  "chainId": 3270,
  "explorers": [],
  "faucets": [
    "https://faucet.arabianchain.org/"
  ],
  "features": [],
  "infoURL": "https://arabianchain.org",
  "name": "Dubxcoin testnet",
  "nativeCurrency": {
    "name": "Dubxcoin testnet",
    "symbol": "TDUBX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://dubxcoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctestnet.arabianchain.org"
  ],
  "shortName": "testdubx",
  "slug": "dubxcoin-testnet",
  "testnet": true
} as const satisfies Chain;