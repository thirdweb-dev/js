import type { Chain } from "../src/types";
export default {
  "chain": "okbchain",
  "chainId": 195,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/okbc-test",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.oklink.com/okbc-test"
  ],
  "features": [],
  "infoURL": "https://www.okx.com/okbc/docs/dev/quick-start/introduction/introduction-to-okbchain",
  "name": "OKBChain Testnet",
  "nativeCurrency": {
    "name": "OKBChain Global Utility Token in testnet",
    "symbol": "OKB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://okbchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://okbtestrpc.okbchain.org"
  ],
  "shortName": "tokb",
  "slug": "okbchain-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;