import type { Chain } from "../src/types";
export default {
  "chain": "NCN",
  "chainId": 303,
  "explorers": [
    {
      "name": "neuroscan",
      "url": "https://testnet.ncnscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.neurochain.ai",
  "name": "Neurochain Testnet",
  "nativeCurrency": {
    "name": "Neurochain",
    "symbol": "tNCN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://neurochain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nc-rpc-test1.neurochain.io"
  ],
  "shortName": "ncnt",
  "slug": "neurochain-testnet",
  "testnet": true
} as const satisfies Chain;