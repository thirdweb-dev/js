import type { Chain } from "../src/types";
export default {
  "name": "eLiberty Testnet",
  "chain": "$EL",
  "icon": {
    "url": "ipfs://Qmcr8US1DZcK3ooiMtE8tEQPgep12abXzxPw1jCkgZhji9",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "rpc": [
    "https://eliberty-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.eliberty.ngo"
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
  "shortName": "ELt",
  "chainId": 99099,
  "networkId": 99099,
  "explorers": [
    {
      "name": "eLiberty Testnet",
      "url": "https://testnet.eliberty.ngo",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "eliberty-testnet"
} as const satisfies Chain;