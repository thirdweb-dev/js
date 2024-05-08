import type { Chain } from "../src/types";
export default {
  "chain": "OpTrust",
  "chainId": 5317,
  "explorers": [
    {
      "name": "OpTrust Testnet explorer",
      "url": "https://scantest.optrust.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://optrust.io",
  "name": "OpTrust Testnet",
  "nativeCurrency": {
    "name": "TestBSC",
    "symbol": "tBNB",
    "decimals": 18
  },
  "networkId": 5317,
  "rpc": [
    "https://5317.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.optrust.io"
  ],
  "shortName": "toptrust",
  "slug": "optrust-testnet",
  "testnet": true
} as const satisfies Chain;