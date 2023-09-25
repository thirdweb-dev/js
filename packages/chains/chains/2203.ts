import type { Chain } from "../src/types";
export default {
  "chainId": 2203,
  "chain": "Bitcoin EVM",
  "name": "Bitcoin EVM",
  "rpc": [
    "https://bitcoin-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.bitcoinevm.com"
  ],
  "slug": "bitcoin-evm",
  "icon": {
    "url": "ipfs://bafkreic4aq265oaf6yze7ba5okefqh6vnqudyrz6ovukvbnrlhet36itle",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://bitcoinevm.com",
  "shortName": "BTC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Explorer",
      "url": "https://explorer.bitcoinevm.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;