import type { Chain } from "../types";
export default {
  "chain": "Bitcoin EVM",
  "chainId": 2203,
  "explorers": [
    {
      "name": "Explorer",
      "url": "https://explorer.bitcoinevm.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreic4aq265oaf6yze7ba5okefqh6vnqudyrz6ovukvbnrlhet36itle",
        "width": 200,
        "height": 200,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreic4aq265oaf6yze7ba5okefqh6vnqudyrz6ovukvbnrlhet36itle",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://bitcoinevm.com",
  "name": "Bitcoin EVM",
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 2203,
  "rpc": [
    "https://bitcoin-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2203.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.bitcoinevm.com"
  ],
  "shortName": "BTC",
  "slug": "bitcoin-evm",
  "testnet": false
} as const satisfies Chain;