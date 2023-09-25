import type { Chain } from "../src/types";
export default {
  "chainId": 990,
  "chain": "$EL",
  "name": "eLiberty Mainnet",
  "rpc": [
    "https://eliberty.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eliberty.ngo"
  ],
  "slug": "eliberty",
  "icon": {
    "url": "ipfs://Qmcr8US1DZcK3ooiMtE8tEQPgep12abXzxPw1jCkgZhji9",
    "width": 150,
    "height": 150,
    "format": "png"
  },
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
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "eLiberty Mainnet",
      "url": "https://explorer.eliberty.ngo",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;