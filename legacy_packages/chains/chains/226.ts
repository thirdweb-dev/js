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
  "infoURL": "https://lachain.io",
  "name": "LACHAIN Testnet",
  "nativeCurrency": {
    "name": "TLA",
    "symbol": "TLA",
    "decimals": 18
  },
  "networkId": 226,
  "rpc": [
    "https://226.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.lachain.io"
  ],
  "shortName": "TLA",
  "slip44": 1,
  "slug": "lachain-testnet",
  "testnet": true
} as const satisfies Chain;