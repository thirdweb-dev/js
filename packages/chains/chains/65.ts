import type { Chain } from "../src/types";
export default {
  "chain": "okexchain",
  "chainId": 65,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/okexchain-test",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.okex.com/drawdex"
  ],
  "features": [],
  "infoURL": "https://www.okex.com/okexchain",
  "name": "OKExChain Testnet",
  "nativeCurrency": {
    "name": "OKExChain Global Utility Token in testnet",
    "symbol": "OKT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://okexchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://exchaintestrpc.okex.org"
  ],
  "shortName": "tokt",
  "slug": "okexchain-testnet",
  "testnet": true
} as const satisfies Chain;