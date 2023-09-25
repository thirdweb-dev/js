import type { Chain } from "../src/types";
export default {
  "chainId": 7355310,
  "chain": "VSL",
  "name": "OpenVessel",
  "rpc": [
    "https://openvessel.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-external.openvessel.io"
  ],
  "slug": "openvessel",
  "icon": {
    "url": "ipfs://QmeknNzGCZXQK7egwfwyxQan7Lw8bLnqYsyoEgEbDNCzJX",
    "width": 600,
    "height": 529,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Vessel ETH",
    "symbol": "VETH",
    "decimals": 18
  },
  "infoURL": "https://www.openvessel.io",
  "shortName": "vsl",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "openvessel-mainnet",
      "url": "https://mainnet-explorer.openvessel.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;