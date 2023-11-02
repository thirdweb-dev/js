import type { Chain } from "../src/types";
export default {
  "chain": "VSL",
  "chainId": 7355310,
  "explorers": [
    {
      "name": "openvessel-mainnet",
      "url": "https://mainnet-explorer.openvessel.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeknNzGCZXQK7egwfwyxQan7Lw8bLnqYsyoEgEbDNCzJX",
    "width": 600,
    "height": 529,
    "format": "png"
  },
  "infoURL": "https://www.openvessel.io",
  "name": "OpenVessel",
  "nativeCurrency": {
    "name": "Vessel ETH",
    "symbol": "VETH",
    "decimals": 18
  },
  "networkId": 7355310,
  "rpc": [
    "https://openvessel.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7355310.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-external.openvessel.io"
  ],
  "shortName": "vsl",
  "slug": "openvessel",
  "testnet": false
} as const satisfies Chain;