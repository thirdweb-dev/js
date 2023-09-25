import type { Chain } from "../src/types";
export default {
  "chainId": 20180430,
  "chain": "Spectrum",
  "name": "SmartMesh Mainnet",
  "rpc": [
    "https://smartmesh.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonapi1.smartmesh.cn"
  ],
  "slug": "smartmesh",
  "faucets": [],
  "nativeCurrency": {
    "name": "SmartMesh Native Token",
    "symbol": "SMT",
    "decimals": 18
  },
  "infoURL": "https://smartmesh.io",
  "shortName": "spectrum",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "spectrum",
      "url": "https://spectrum.pub",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;