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
  "name": "Galadriel Testnet",
  "nativeCurrency": {
    "name": "Galadriel Testnet token",
    "symbol": "GAL",
    "decimals": 18
  },
  "networkId": 696969,
  "rpc": [
    "https://696969.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.galadriel.com"
  ],
  "shortName": "galadriel-testnet",
  "slug": "galadriel-testnet",
  "testnet": true
} as const satisfies Chain;