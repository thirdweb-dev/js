import type { Chain } from "../src/types";
export default {
  "chain": "Galadriel",
  "chainId": 696969,
  "explorers": [
    {
      "name": "Galadriel Explorer",
      "url": "https://explorer.galadriel.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://docs.galadriel.com/faucet"
  ],
  "infoURL": "https://galadriel.com",
  "name": "Galadriel Devnet",
  "nativeCurrency": {
    "name": "Galadriel Devnet token",
    "symbol": "GAL",
    "decimals": 18
  },
  "networkId": 696969,
  "rpc": [
    "https://696969.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.galadriel.com"
  ],
  "shortName": "galadriel-devnet",
  "slug": "galadriel-devnet",
  "testnet": false
} as const satisfies Chain;