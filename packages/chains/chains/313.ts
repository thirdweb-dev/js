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
  "icon": {
    "url": "ipfs://Qmc9zDWXar67cMUodp28mbN5pnwbVibxGXhwa8YCDvxmTR",
    "width": 62,
    "height": 59,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "neuroscan",
      "url": "https://ncnscan.com",
      "icon": {
        "url": "ipfs://Qmc9zDWXar67cMUodp28mbN5pnwbVibxGXhwa8YCDvxmTR",
        "width": 62,
        "height": 59,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "neurochain"
} as const satisfies Chain;