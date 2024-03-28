import type { Chain } from "../src/types";
export default {
  "chain": "TESTDUBX",
  "chainId": 3270,
  "explorers": [],
  "faucets": [
    "https://faucet.arabianchain.org/"
  ],
  "infoURL": "https://arabianchain.org",
  "name": "Dubxcoin testnet",
  "nativeCurrency": {
    "name": "Dubxcoin testnet",
    "symbol": "TDUBX",
    "decimals": 18
  },
  "networkId": 3270,
  "rpc": [
    "https://3270.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctestnet.arabianchain.org"
  ],
  "shortName": "testdubx",
  "slip44": 1,
  "slug": "dubxcoin-testnet",
  "testnet": true
} as const satisfies Chain;