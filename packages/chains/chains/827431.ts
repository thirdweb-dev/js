import type { Chain } from "../src/types";
export default {
  "chainId": 827431,
  "chain": "CURVE",
  "name": "CURVE Mainnet",
  "rpc": [
    "https://curve.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.curvescan.io"
  ],
  "slug": "curve",
  "icon": {
    "url": "ipfs://QmTjV3TTR5aLb7fi7tjx8gcDvYtqBpusqhCSaznVxJ7NJg",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Curve",
    "symbol": "CURVE",
    "decimals": 18
  },
  "infoURL": "https://curvescan.io",
  "shortName": "CURVEm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "CURVE Mainnet",
      "url": "https://curvescan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;