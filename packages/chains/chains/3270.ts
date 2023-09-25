import type { Chain } from "../src/types";
export default {
  "chainId": 3270,
  "chain": "TESTDUBX",
  "name": "Dubxcoin testnet",
  "rpc": [
    "https://dubxcoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctestnet.arabianchain.org"
  ],
  "slug": "dubxcoin-testnet",
  "faucets": [
    "https://faucet.arabianchain.org/"
  ],
  "nativeCurrency": {
    "name": "Dubxcoin testnet",
    "symbol": "TDUBX",
    "decimals": 18
  },
  "infoURL": "https://arabianchain.org",
  "shortName": "testdubx",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;