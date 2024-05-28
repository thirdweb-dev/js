import type { Chain } from "../src/types";
export default {
  "chain": "ella",
  "chainId": 7027,
  "explorers": [
    {
      "name": "Ella",
      "url": "https://ella.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ella.network",
  "name": "Ella the heart",
  "nativeCurrency": {
    "name": "Ella",
    "symbol": "ELLA",
    "decimals": 18
  },
  "networkId": 7027,
  "rpc": [
    "https://7027.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ella.network"
  ],
  "shortName": "ELLA",
  "slug": "ella-the-heart",
  "testnet": false
} as const satisfies Chain;