import type { Chain } from "../src/types";
export default {
  "chain": "xgon",
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
  "name": "Xgon Testnet",
  "nativeCurrency": {
    "name": "Xgon Global Utility Token in testnet",
    "symbol": "OKB",
    "decimals": 18
  },
  "networkId": 195,
  "rpc": [
    "https://xgon-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://195.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.xgon.io"
  ],
  "shortName": "tokb",
  "slug": "xgon-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;