import type { Chain } from "../src/types";
export default {
  "chainId": 99099,
  "chain": "$EL",
  "name": "eLiberty Testnet",
  "rpc": [
    "https://eliberty-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.eliberty.ngo"
  ],
  "slug": "eliberty-testnet",
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
  "shortName": "ELt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "eLiberty Testnet",
      "url": "https://testnet.eliberty.ngo",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;