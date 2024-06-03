import type { Chain } from "../src/types";
export default {
  "chain": "Settlus",
  "chainId": 5372,
  "explorers": [
    {
      "name": "Settlus Scan",
      "url": "https://testnet.settlus.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.settlus.io"
  ],
  "infoURL": "https://settlus.org",
  "name": "Settlus Testnet",
  "nativeCurrency": {
    "name": "Setl",
    "symbol": "SETL",
    "decimals": 18
  },
  "networkId": 5372,
  "rpc": [
    "https://5372.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://settlus-test-eth.settlus.io"
  ],
  "shortName": "settlus-testnet",
  "slug": "settlus-testnet",
  "testnet": true
} as const satisfies Chain;