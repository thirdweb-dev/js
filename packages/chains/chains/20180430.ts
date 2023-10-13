import type { Chain } from "../src/types";
export default {
  "chain": "Spectrum",
  "chainId": 20180430,
  "explorers": [
    {
      "name": "spectrum",
      "url": "https://spectrum.pub",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://smartmesh.io",
  "name": "SmartMesh Mainnet",
  "nativeCurrency": {
    "name": "SmartMesh Native Token",
    "symbol": "SMT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://smartmesh.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonapi1.smartmesh.cn"
  ],
  "shortName": "spectrum",
  "slug": "smartmesh",
  "testnet": false
} as const satisfies Chain;