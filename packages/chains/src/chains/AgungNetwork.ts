import type { Chain } from "../types";
export default {
  "chain": "Agung",
  "chainId": 9990,
  "explorers": [
    {
      "name": "Polkadot.js",
      "url": "https://polkadot.js.org/apps/?rpc=wss://wsspc1-qa.agung.peaq.network#/explorer",
      "standard": "none"
    },
    {
      "name": "Subscan",
      "url": "https://agung.subscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreibkqdof3ztkdhgukwvkacwgrjb27e23hgz5c6mmudzu5hipyvgisa",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://www.peaq.network",
  "name": "Agung Network",
  "nativeCurrency": {
    "name": "Agung",
    "symbol": "AGNG",
    "decimals": 18
  },
  "networkId": 9990,
  "rpc": [
    "https://agung-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9990.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcpc1-qa.agung.peaq.network"
  ],
  "shortName": "AGNG",
  "slug": "agung-network",
  "testnet": false
} as const satisfies Chain;