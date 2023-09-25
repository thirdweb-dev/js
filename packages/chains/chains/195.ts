import type { Chain } from "../src/types";
export default {
  "chainId": 195,
  "chain": "okbchain",
  "name": "OKBChain Testnet",
  "rpc": [
    "https://okbchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://okbtestrpc.okbchain.org"
  ],
  "slug": "okbchain-testnet",
  "faucets": [
    "https://www.oklink.com/okbc-test"
  ],
  "nativeCurrency": {
    "name": "OKBChain Global Utility Token in testnet",
    "symbol": "OKB",
    "decimals": 18
  },
  "infoURL": "https://www.okx.com/okbc/docs/dev/quick-start/introduction/introduction-to-okbchain",
  "shortName": "tokb",
  "testnet": true,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/okbc-test",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;