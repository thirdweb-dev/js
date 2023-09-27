import type { Chain } from "../src/types";
export default {
  "name": "The Krest Network",
  "chain": "Krest",
  "icon": {
    "url": "ipfs://bafkreid3bhzhughhjwq3rpgiic5zesj5mekqktawt646itdyqtvjxoupca",
    "width": 257,
    "height": 257,
    "format": "svg"
  },
  "rpc": [
    "https://the-krest-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://erpc-krest.peaq.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Krest",
    "symbol": "KRST",
    "decimals": 18
  },
  "infoURL": "https://www.peaq.network",
  "shortName": "KRST",
  "chainId": 2241,
  "networkId": 2241,
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
  "testnet": false,
  "slug": "the-krest-network"
} as const satisfies Chain;