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
  "infoURL": "https://www.okex.com/okexchain",
  "name": "OKExChain Testnet",
  "nativeCurrency": {
    "name": "OKExChain Global Utility Token in testnet",
    "symbol": "OKT",
    "decimals": 18
  },
  "networkId": 65,
  "rpc": [
    "https://65.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://exchaintestrpc.okex.org"
  ],
  "shortName": "tokt",
  "slip44": 1,
  "slug": "okexchain-testnet",
  "testnet": true
} as const satisfies Chain;