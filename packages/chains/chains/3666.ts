import type { Chain } from "../src/types";
export default {
  "chainId": 3666,
  "chain": "Jouleverse",
  "name": "Jouleverse Mainnet",
  "rpc": [
    "https://jouleverse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jnsdao.com:8503"
  ],
  "slug": "jouleverse",
  "faucets": [],
  "nativeCurrency": {
    "name": "J",
    "symbol": "J",
    "decimals": 18
  },
  "infoURL": "https://jnsdao.com",
  "shortName": "jouleverse",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "jscan",
      "url": "https://jscan.jnsdao.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;