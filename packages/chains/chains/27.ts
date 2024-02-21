import type { Chain } from "../src/types";
export default {
  "chain": "SHIB",
  "chainId": 27,
  "explorers": [
    {
      "name": "Shiba Explorer",
      "url": "https://exp.shibchain.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://shibchain.org",
  "name": "ShibaChain",
  "nativeCurrency": {
    "name": "SHIBA INU COIN",
    "symbol": "SHIB",
    "decimals": 18
  },
  "networkId": 27,
  "rpc": [
    "https://27.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shibchain.org"
  ],
  "shortName": "shib",
  "slug": "shibachain",
  "testnet": false
} as const satisfies Chain;