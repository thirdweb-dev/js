import type { Chain } from "../src/types";
export default {
  "chainId": 226,
  "chain": "TLA",
  "name": "LACHAIN Testnet",
  "rpc": [
    "https://lachain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.lachain.io"
  ],
  "slug": "lachain-testnet",
  "icon": {
    "url": "ipfs://QmQxGA6rhuCQDXUueVcNvFRhMEWisyTmnF57TqL7h6k6cZ",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "TLA",
    "symbol": "TLA",
    "decimals": 18
  },
  "infoURL": "https://lachain.io",
  "shortName": "TLA",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan-test.lachain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;