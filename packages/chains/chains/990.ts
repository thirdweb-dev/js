import type { Chain } from "../src/types";
export default {
  "name": "eLiberty Mainnet",
  "chain": "$EL",
  "icon": {
    "url": "ipfs://Qmcr8US1DZcK3ooiMtE8tEQPgep12abXzxPw1jCkgZhji9",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "rpc": [
    "https://eliberty.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eliberty.ngo"
  ],
  "faucets": [
    "https://faucet.eliberty.ngo"
  ],
  "nativeCurrency": {
    "name": "eLiberty",
    "symbol": "$EL",
    "decimals": 18
  },
  "infoURL": "https://eliberty.ngo",
  "shortName": "ELm",
  "chainId": 990,
  "networkId": 990,
  "explorers": [
    {
      "name": "eLiberty Mainnet",
      "url": "https://explorer.eliberty.ngo",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "eliberty"
} as const satisfies Chain;