import type { Chain } from "../src/types";
export default {
  "name": "Dubxcoin testnet",
  "chain": "TESTDUBX",
  "rpc": [
    "https://dubxcoin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctestnet.arabianchain.org"
  ],
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
  "chainId": 3270,
  "networkId": 3270,
  "testnet": true,
  "slug": "dubxcoin-testnet"
} as const satisfies Chain;