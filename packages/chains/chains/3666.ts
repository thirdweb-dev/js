import type { Chain } from "../src/types";
export default {
  "name": "Jouleverse Mainnet",
  "chain": "Jouleverse",
  "rpc": [
    "https://jouleverse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jnsdao.com:8503"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "J",
    "symbol": "J",
    "decimals": 18
  },
  "infoURL": "https://jnsdao.com",
  "shortName": "jouleverse",
  "chainId": 3666,
  "networkId": 3666,
  "explorers": [
    {
      "name": "jscan",
      "url": "https://jscan.jnsdao.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "jouleverse"
} as const satisfies Chain;