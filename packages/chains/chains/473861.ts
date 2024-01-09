import type { Chain } from "../src/types";
export default {
  "chain": "ultrapro",
  "chainId": 473861,
  "explorers": [
    {
      "name": "ultraproscan",
      "url": "https://ultraproscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmT11iJMLe9sAk5NiRQbe2wv1jtLFCs2sF2w9vFwDLkkgE",
        "width": 500,
        "height": 500,
        "format": "png"
      }
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
  "icon": {
    "url": "ipfs://QmT11iJMLe9sAk5NiRQbe2wv1jtLFCs2sF2w9vFwDLkkgE",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://ultrapro.info",
  "name": "Ultra Pro Mainnet",
  "nativeCurrency": {
    "name": "Ultra Pro",
    "symbol": "UPRO",
    "decimals": 18
  },
  "networkId": 473861,
  "rpc": [
    "https://ultra-pro.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://473861.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.ultraproscan.io"
  ],
  "shortName": "ultrapro",
  "slug": "ultra-pro",
  "testnet": false
} as const satisfies Chain;