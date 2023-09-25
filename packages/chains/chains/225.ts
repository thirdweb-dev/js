import type { Chain } from "../src/types";
export default {
  "chainId": 225,
  "chain": "LA",
  "name": "LACHAIN Mainnet",
  "rpc": [
    "https://lachain-LA.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.lachain.io"
  ],
  "slug": "lachain-LA",
  "icon": {
    "url": "ipfs://QmQxGA6rhuCQDXUueVcNvFRhMEWisyTmnF57TqL7h6k6cZ",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "LA",
    "symbol": "LA",
    "decimals": 18
  },
  "infoURL": "https://lachain.io",
  "shortName": "LA",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.lachain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;