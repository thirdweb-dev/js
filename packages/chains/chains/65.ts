import type { Chain } from "../src/types";
export default {
  "chainId": 65,
  "chain": "okexchain",
  "name": "OKExChain Testnet",
  "rpc": [
    "https://okexchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://exchaintestrpc.okex.org"
  ],
  "slug": "okexchain-testnet",
  "faucets": [
    "https://www.okex.com/drawdex"
  ],
  "nativeCurrency": {
    "name": "OKExChain Global Utility Token in testnet",
    "symbol": "OKT",
    "decimals": 18
  },
  "infoURL": "https://www.okex.com/okexchain",
  "shortName": "tokt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/okexchain-test",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;