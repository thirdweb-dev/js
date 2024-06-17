import type { Chain } from "../src/types";
export default {
  "chain": "LUDAN",
  "chainId": 1688,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.ludan.org/",
  "name": "LUDAN Mainnet",
  "nativeCurrency": {
    "name": "LUDAN",
    "symbol": "LUDAN",
    "decimals": 18
  },
  "networkId": 1688,
  "rpc": [
    "https://1688.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ludan.org/"
  ],
  "shortName": "LUDAN",
  "slug": "ludan",
  "testnet": false
} as const satisfies Chain;