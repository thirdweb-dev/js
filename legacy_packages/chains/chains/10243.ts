import type { Chain } from "../src/types";
export default {
  "chain": "AA",
  "chainId": 10243,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer-test.arthera.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.arthera.net"
  ],
  "infoURL": "https://docs.arthera.net",
  "name": "Arthera Testnet",
  "nativeCurrency": {
    "name": "Arthera",
    "symbol": "AA",
    "decimals": 18
  },
  "networkId": 10243,
  "rpc": [
    "https://10243.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test.arthera.net"
  ],
  "shortName": "aat",
  "slip44": 1,
  "slug": "arthera-testnet",
  "testnet": true
} as const satisfies Chain;