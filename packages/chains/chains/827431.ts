import type { Chain } from "../src/types";
export default {
  "name": "CURVE Mainnet",
  "chain": "CURVE",
  "icon": {
    "url": "ipfs://QmTjV3TTR5aLb7fi7tjx8gcDvYtqBpusqhCSaznVxJ7NJg",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "rpc": [
    "https://curve.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.curvescan.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Curve",
    "symbol": "CURVE",
    "decimals": 18
  },
  "infoURL": "https://curvescan.io",
  "shortName": "CURVEm",
  "chainId": 827431,
  "networkId": 827431,
  "explorers": [
    {
      "name": "CURVE Mainnet",
      "url": "https://curvescan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "curve"
} as const satisfies Chain;