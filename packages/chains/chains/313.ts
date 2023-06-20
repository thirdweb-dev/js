import type { Chain } from "../src/types";
export default {
  "name": "Neurochain Mainnet",
  "chain": "NCN",
  "rpc": [
    "https://neurochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nc-rpc-prd1.neurochain.io",
    "https://nc-rpc-prd2.neurochain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Neurochain",
    "symbol": "NCN",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.neurochain.ai",
  "shortName": "ncn",
  "chainId": 313,
  "networkId": 313,
  "explorers": [
    {
      "name": "neuroscan",
      "url": "https://ncnscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "neurochain"
} as const satisfies Chain;