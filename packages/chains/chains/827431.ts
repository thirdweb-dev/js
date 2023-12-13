import type { Chain } from "../src/types";
export default {
  "chain": "CURVE",
  "chainId": 827431,
  "explorers": [
    {
      "name": "CURVE Mainnet",
      "url": "https://curvescan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTjV3TTR5aLb7fi7tjx8gcDvYtqBpusqhCSaznVxJ7NJg",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "infoURL": "https://curvescan.io",
  "name": "CURVE Mainnet",
  "nativeCurrency": {
    "name": "Curve",
    "symbol": "CURVE",
    "decimals": 18
  },
  "networkId": 827431,
  "rpc": [
    "https://curve.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://827431.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.curvescan.io"
  ],
  "shortName": "CURVEm",
  "slug": "curve",
  "testnet": false
} as const satisfies Chain;