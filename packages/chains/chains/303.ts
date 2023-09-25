import type { Chain } from "../src/types";
export default {
  "chainId": 303,
  "chain": "NCN",
  "name": "Neurochain Testnet",
  "rpc": [
    "https://neurochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nc-rpc-test1.neurochain.io"
  ],
  "slug": "neurochain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Neurochain",
    "symbol": "NCN",
    "decimals": 18
  },
  "infoURL": "https://www.neurochain.ai",
  "shortName": "ncnt",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "neuroscan",
      "url": "https://testnet.ncnscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;