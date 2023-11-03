import type { Chain } from "../types";
export default {
  "chain": "$EL",
  "chainId": 990,
  "explorers": [
    {
      "name": "eLiberty Mainnet",
      "url": "https://explorer.eliberty.ngo",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.eliberty.ngo"
  ],
  "icon": {
    "url": "ipfs://Qmcr8US1DZcK3ooiMtE8tEQPgep12abXzxPw1jCkgZhji9",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "infoURL": "https://eliberty.ngo",
  "name": "eLiberty Mainnet",
  "nativeCurrency": {
    "name": "eLiberty",
    "symbol": "$EL",
    "decimals": 18
  },
  "networkId": 990,
  "rpc": [
    "https://eliberty.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://990.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eliberty.ngo"
  ],
  "shortName": "ELm",
  "slug": "eliberty",
  "testnet": false
} as const satisfies Chain;