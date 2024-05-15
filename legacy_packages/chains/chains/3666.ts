import type { Chain } from "../src/types";
export default {
  "chain": "Jouleverse",
  "chainId": 3666,
  "explorers": [
    {
      "name": "jscan",
      "url": "https://jscan.jnsdao.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://jnsdao.com",
  "name": "Jouleverse Mainnet",
  "nativeCurrency": {
    "name": "J",
    "symbol": "J",
    "decimals": 18
  },
  "networkId": 3666,
  "rpc": [
    "https://3666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jnsdao.com:8503"
  ],
  "shortName": "jouleverse",
  "slug": "jouleverse",
  "testnet": false
} as const satisfies Chain;