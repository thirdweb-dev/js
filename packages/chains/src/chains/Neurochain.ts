import type { Chain } from "../types";
export default {
  "chain": "NCN",
  "chainId": 313,
  "explorers": [
    {
      "name": "neuroscan",
      "url": "https://ncnscan.com",
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
  "name": "Neurochain Mainnet",
  "nativeCurrency": {
    "name": "Neurochain",
    "symbol": "NCN",
    "decimals": 18
  },
  "networkId": 313,
  "rpc": [
    "https://neurochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://313.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nc-rpc-prd1.neurochain.io",
    "https://nc-rpc-prd2.neurochain.io"
  ],
  "shortName": "ncn",
  "slug": "neurochain",
  "testnet": false
} as const satisfies Chain;