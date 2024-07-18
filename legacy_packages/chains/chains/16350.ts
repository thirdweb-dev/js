import type { Chain } from "../src/types";
export default {
  "chain": "Incentiv",
  "chainId": 16350,
  "explorers": [],
  "faucets": [
    "https://faucet.incentiv-dev.ankr.network"
  ],
  "infoURL": "https://incentiv.net",
  "name": "Incentiv Devnet",
  "nativeCurrency": {
    "name": "Testnet INC",
    "symbol": "INC",
    "decimals": 18
  },
  "networkId": 16350,
  "rpc": [
    "https://16350.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ankr.com/incentiv_devnet"
  ],
  "shortName": "tIncentiv",
  "slip44": 1,
  "slug": "incentiv-devnet",
  "testnet": true
} as const satisfies Chain;