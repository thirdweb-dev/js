import type { Chain } from "../types";
export default {
  "chain": "OmegaNetwork",
  "chainId": 408,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreig676zxfhwhcx5bvvvjxedx6ftr2wq4iiznrwm3c6ozrprbc4oxwm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Omega Mainnet",
  "nativeCurrency": {
    "name": "Omega Network Coin",
    "symbol": "OMN",
    "decimals": 18
  },
  "networkId": 408,
  "redFlags": [],
  "rpc": [
    "https://omega.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://408.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.omtch.com"
  ],
  "shortName": "OmegaNetwork",
  "slug": "omega",
  "testnet": false
} as const satisfies Chain;