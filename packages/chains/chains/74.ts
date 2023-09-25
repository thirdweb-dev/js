import type { Chain } from "../src/types";
export default {
  "chainId": 74,
  "chain": "IDChain",
  "name": "IDChain Mainnet",
  "rpc": [
    "https://idchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://idchain.one/rpc/",
    "wss://idchain.one/ws/"
  ],
  "slug": "idchain",
  "icon": {
    "url": "ipfs://QmZVwsY6HPXScKqZCA9SWNrr4jrQAHkPhVhMWi6Fj1DsrJ",
    "width": 162,
    "height": 129,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "EIDI",
    "symbol": "EIDI",
    "decimals": 18
  },
  "infoURL": "https://idchain.one/begin/",
  "shortName": "idchain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.idchain.one",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;