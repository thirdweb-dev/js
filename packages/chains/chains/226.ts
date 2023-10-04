import type { Chain } from "../src/types";
export default {
  "chain": "TLA",
  "chainId": 226,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan-test.lachain.io",
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
  "name": "LACHAIN Testnet",
  "nativeCurrency": {
    "name": "TLA",
    "symbol": "TLA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://lachain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.lachain.io"
  ],
  "shortName": "TLA",
  "slug": "lachain-testnet",
  "testnet": true
} as const satisfies Chain;