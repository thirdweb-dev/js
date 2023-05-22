import type { Chain } from "../src/types";
export default {
  "name": "ShibaChain",
  "chain": "SHIB",
  "rpc": [
    "https://shibachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shibchain.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SHIBA INU COIN",
    "symbol": "SHIB",
    "decimals": 18
  },
  "infoURL": "https://shibchain.org",
  "shortName": "shib",
  "chainId": 27,
  "networkId": 27,
  "explorers": [
    {
      "name": "Shiba Explorer",
      "url": "https://exp.shibchain.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "shibachain"
} as const satisfies Chain;