import type { Chain } from "../src/types";
export default {
  "chainId": 4181,
  "chain": "PHI V1",
  "name": "PHI Network V1",
  "rpc": [
    "https://phi-network-v1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.phi.network",
    "https://rpc2.phi.network"
  ],
  "slug": "phi-network-v1",
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
  "shortName": "PHIv1",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "PHI Explorer",
      "url": "https://explorer.phi.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;