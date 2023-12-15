import type { Chain } from "../src/types";
export default {
  "chain": "Krest",
  "chainId": 2241,
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
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreid732273ib5at7krjdl2t7lteljlepwd3tvifqge7mu7g6naxavhe",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://www.peaq.network",
  "name": "Krest Network",
  "nativeCurrency": {
    "name": "Krest",
    "symbol": "KRST",
    "decimals": 18
  },
  "networkId": 2241,
  "rpc": [
    "https://krest-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2241.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://erpc-krest.peaq.network",
    "https://krest.unitedbloc.com"
  ],
  "shortName": "KRST",
  "slug": "krest-network",
  "testnet": false
} as const satisfies Chain;