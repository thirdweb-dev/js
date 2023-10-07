import type { Chain } from "../src/types";
export default {
  "chain": "PHI",
  "chainId": 144,
  "explorers": [
    {
      "name": "Phiscan",
      "url": "https://phiscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreid6pm3mic7izp3a6zlfwhhe7etd276bjfsq2xash6a4s2vmcdf65a",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://phi.network",
  "name": "PHI Network v2",
  "nativeCurrency": {
    "name": "PHI",
    "symbol": "Φ",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://phi-network-v2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.phi.network"
  ],
  "shortName": "PHI",
  "slug": "phi-network-v2",
  "testnet": false
} as const satisfies Chain;