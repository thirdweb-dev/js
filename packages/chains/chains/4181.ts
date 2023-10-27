import type { Chain } from "../src/types";
export default {
  "chain": "PHI V1",
  "chainId": 4181,
  "explorers": [
    {
      "name": "PHI Explorer",
      "url": "https://explorer.phi.network",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreid6pm3mic7izp3a6zlfwhhe7etd276bjfsq2xash6a4s2vmcdf65a",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreid6pm3mic7izp3a6zlfwhhe7etd276bjfsq2xash6a4s2vmcdf65a",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://phi.network",
  "name": "PHI Network V1",
  "nativeCurrency": {
    "name": "PHI",
    "symbol": "Φ",
    "decimals": 18
  },
  "networkId": 4181,
  "rpc": [
    "https://phi-network-v1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4181.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.phi.network",
    "https://rpc2.phi.network"
  ],
  "shortName": "PHIv1",
  "slug": "phi-network-v1",
  "testnet": false
} as const satisfies Chain;