import type { Chain } from "../src/types";
export default {
  "chainId": 2241,
  "chain": "Krest",
  "name": "The Krest Network",
  "rpc": [
    "https://the-krest-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://erpc-krest.peaq.network"
  ],
  "slug": "the-krest-network",
  "icon": {
    "url": "ipfs://bafkreid3bhzhughhjwq3rpgiic5zesj5mekqktawt646itdyqtvjxoupca",
    "width": 257,
    "height": 257,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Krest",
    "symbol": "KRST",
    "decimals": 18
  },
  "infoURL": "https://www.peaq.network",
  "shortName": "KRST",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Polkadot.js",
      "url": "https://polkadot.js.org/apps/?rpc=wss://wss-krest.peaq.network#/explorer",
      "standard": "none"
    },
    {
      "name": "Subscan",
      "url": "https://krest.subscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;