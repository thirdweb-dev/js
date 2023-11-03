import type { Chain } from "../types";
export default {
  "chain": "$EL",
  "chainId": 99099,
  "explorers": [
    {
      "name": "eLiberty Testnet",
      "url": "https://testnet.eliberty.ngo",
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
  "name": "eLiberty Testnet",
  "nativeCurrency": {
    "name": "eLiberty",
    "symbol": "$EL",
    "decimals": 18
  },
  "networkId": 99099,
  "rpc": [
    "https://eliberty-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://99099.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.eliberty.ngo"
  ],
  "shortName": "ELt",
  "slug": "eliberty-testnet",
  "testnet": true
} as const satisfies Chain;