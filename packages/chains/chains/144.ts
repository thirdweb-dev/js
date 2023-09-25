import type { Chain } from "../src/types";
export default {
  "chainId": 144,
  "chain": "PHI",
  "name": "PHI Network v2",
  "rpc": [
    "https://phi-network-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.phi.network"
  ],
  "slug": "phi-network-v2",
  "icon": {
    "url": "ipfs://bafkreid6pm3mic7izp3a6zlfwhhe7etd276bjfsq2xash6a4s2vmcdf65a",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "PHI",
    "symbol": "Φ",
    "decimals": 18
  },
  "infoURL": "https://phi.network",
  "shortName": "PHI",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Phiscan",
      "url": "https://phiscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;