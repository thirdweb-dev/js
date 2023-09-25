import type { Chain } from "../src/types";
export default {
  "chainId": 27,
  "chain": "SHIB",
  "name": "ShibaChain",
  "rpc": [
    "https://shibachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shibchain.org"
  ],
  "slug": "shibachain",
  "faucets": [],
  "nativeCurrency": {
    "name": "SHIBA INU COIN",
    "symbol": "SHIB",
    "decimals": 18
  },
  "infoURL": "https://shibchain.org",
  "shortName": "shib",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Shiba Explorer",
      "url": "https://exp.shibchain.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;