import type { Chain } from "../src/types";
export default {
  "chain": "MetaDAP",
  "chainId": 91120,
  "explorers": [
    {
      "name": "MetaDAP Enterprise Mainnet explorer",
      "url": "https://explorer.chain.metadap.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcCFUTStKKJKfzTwrjfMFoVaPCMsvAvWXRdDkYMvCkEs3",
    "width": 800,
    "height": 800,
    "format": "svg"
  },
  "infoURL": "https://metadap.io/",
  "name": "MetaDAP Enterprise Mainnet",
  "nativeCurrency": {
    "name": "DAP",
    "symbol": "DAP",
    "decimals": 18
  },
  "networkId": 91120,
  "rpc": [
    "https://91120.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chain.metadap.io",
    "wss://rpc-ws.chain.metadap.io"
  ],
  "shortName": "MetaDAP",
  "slug": "metadap-enterprise",
  "testnet": false,
  "title": "MetaDAP Enterprise Mainnet"
} as const satisfies Chain;