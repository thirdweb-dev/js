import type { Chain } from "../src/types";
export default {
  "chain": "SPENT",
  "chainId": 9911,
  "explorers": [
    {
      "name": "escscan",
      "url": "https://escscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://espento.network",
  "name": "Espento Mainnet",
  "nativeCurrency": {
    "name": "ESPENTO",
    "symbol": "SPENT",
    "decimals": 18
  },
  "networkId": 9911,
  "rpc": [
    "https://9911.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.escscan.com/"
  ],
  "shortName": "spent",
  "slug": "espento",
  "testnet": false
} as const satisfies Chain;