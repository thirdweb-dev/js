import type { Chain } from "../src/types";
export default {
  "chain": "Gemuchain",
  "chainId": 1903648807,
  "explorers": [
    {
      "name": "Gemuchain Explorer",
      "url": "https://gemutest-explorer.gemuchain.io",
      "standard": "EIP3091",
      "icon": {
        "url": "https://explorer.gemuchain.io/assets/network_logo.svg",
        "width": 345,
        "height": 48,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://raw.githubusercontent.com/UrfinDeuce/logos/05725373b48fb7e3de75737f621b21a4a6557c76/GemuChain%20logo.svg",
    "width": 345,
    "height": 48,
    "format": "svg"
  },
  "name": "Gemuchain Lab",
  "nativeCurrency": {
    "name": "GEMU",
    "symbol": "GEMU",
    "decimals": 18
  },
  "networkId": 1903648807,
  "redFlags": [],
  "rpc": [
    "https://1903648807.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gemutest-rpc.gemuchain.io"
  ],
  "shortName": "GEMU",
  "slug": "gemuchain-lab",
  "testnet": true
} as const satisfies Chain;