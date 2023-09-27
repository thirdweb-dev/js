import type { Chain } from "../src/types";
export default {
  "name": "Krest Network",
  "chain": "Krest",
  "icon": {
    "url": "ipfs://bafkreid732273ib5at7krjdl2t7lteljlepwd3tvifqge7mu7g6naxavhe",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://krest-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
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
  "slug": "krest-network"
} as const satisfies Chain;