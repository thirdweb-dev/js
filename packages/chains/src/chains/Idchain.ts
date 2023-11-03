import type { Chain } from "../types";
export default {
  "chain": "IDChain",
  "chainId": 74,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.idchain.one",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZVwsY6HPXScKqZCA9SWNrr4jrQAHkPhVhMWi6Fj1DsrJ",
    "width": 162,
    "height": 129,
    "format": "png"
  },
  "infoURL": "https://idchain.one/begin/",
  "name": "IDChain Mainnet",
  "nativeCurrency": {
    "name": "EIDI",
    "symbol": "EIDI",
    "decimals": 18
  },
  "networkId": 74,
  "rpc": [
    "https://idchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://74.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://idchain.one/rpc/",
    "wss://idchain.one/ws/"
  ],
  "shortName": "idchain",
  "slug": "idchain",
  "testnet": false
} as const satisfies Chain;