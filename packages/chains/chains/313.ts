import type { Chain } from "../src/types";
export default {
  "chainId": 313,
  "chain": "NCN",
  "name": "Neurochain Mainnet",
  "rpc": [
    "https://neurochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nc-rpc-prd1.neurochain.io",
    "https://nc-rpc-prd2.neurochain.io"
  ],
  "slug": "neurochain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Neurochain",
    "symbol": "NCN",
    "decimals": 18
  },
  "infoURL": "https://www.neurochain.ai",
  "shortName": "ncn",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "neuroscan",
      "url": "https://ncnscan.com",
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