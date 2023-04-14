import type { Chain } from "../src/types";
export default {
  "name": "OKBChain Testnet",
  "chain": "okbchain",
  "rpc": [
    "https://okbchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://okbtestrpc.okbchain.org"
  ],
  "faucets": [
    "https://www.oklink.com/okbc-test"
  ],
  "nativeCurrency": {
    "name": "OKBChain Global Utility Token in testnet",
    "symbol": "OKB",
    "decimals": 18
  },
  "features": [],
  "infoURL": "https://www.okx.com/okbc/docs/dev/quick-start/introduction/introduction-to-okbchain",
  "shortName": "tokb",
  "chainId": 195,
  "networkId": 195,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/okbc-test",
      "standard": "EIP3091"
    }
  ],
  "status": "active",
  "testnet": true,
  "slug": "okbchain-testnet"
} as const satisfies Chain;