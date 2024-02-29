import type { Chain } from "../src/types";
export default {
  "chain": "MetaDAP",
  "chainId": 119139,
  "explorers": [
    {
      "name": "MetaDAP Enterprise Testnet explorer",
      "url": "https://explorer.testnet.chain.metadap.io",
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
  "name": "MetaDAP Enterprise Testnet",
  "nativeCurrency": {
    "name": "DAP",
    "symbol": "DAP",
    "decimals": 18
  },
  "networkId": 119139,
  "rpc": [
    "https://119139.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.chain.metadap.io",
    "wss://rpc-ws.testnet.chain.metadap.io"
  ],
  "shortName": "MetaDAP-T",
  "slug": "metadap-enterprise-testnet",
  "testnet": true,
  "title": "MetaDAP Enterprise Testnet"
} as const satisfies Chain;