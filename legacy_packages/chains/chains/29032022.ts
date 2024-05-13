import type { Chain } from "../src/types";
export default {
  "chain": "FLX",
  "chainId": 29032022,
  "explorers": [
    {
      "name": "FLXExplorer",
      "url": "https://explorer.flaexchange.top",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.flaexchange.top",
  "name": "Flachain Mainnet",
  "nativeCurrency": {
    "name": "Flacoin",
    "symbol": "FLA",
    "decimals": 18
  },
  "networkId": 29032022,
  "rpc": [
    "https://29032022.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://flachain.flaexchange.top/"
  ],
  "shortName": "fla",
  "slug": "flachain",
  "testnet": false
} as const satisfies Chain;