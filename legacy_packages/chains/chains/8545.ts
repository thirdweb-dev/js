import type { Chain } from "../src/types";
export default {
  "chain": "Chakra Testnet",
  "chainId": 8545,
  "explorers": [],
  "faucets": [],
  "name": "Chakra Testnet",
  "nativeCurrency": {
    "name": "Chakra",
    "symbol": "CKR",
    "decimals": 18
  },
  "networkId": 8545,
  "rpc": [
    "https://8545.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcv1-dn-1.chakrachain.io/"
  ],
  "shortName": "ChakraTN",
  "slug": "chakra-testnet",
  "testnet": true
} as const satisfies Chain;