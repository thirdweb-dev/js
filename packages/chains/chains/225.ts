import type { Chain } from "../src/types";
export default {
  "chain": "LA",
  "chainId": 225,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.lachain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQxGA6rhuCQDXUueVcNvFRhMEWisyTmnF57TqL7h6k6cZ",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "infoURL": "https://lachain.io",
  "name": "LACHAIN Mainnet",
  "nativeCurrency": {
    "name": "LA",
    "symbol": "LA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://lachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.lachain.io"
  ],
  "shortName": "LA",
  "slug": "lachain",
  "testnet": false
} as const satisfies Chain;