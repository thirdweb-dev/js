import type { Chain } from "../src/types";
export default {
  "chainId": 408,
  "chain": "OmegaNetwork",
  "name": "Omega Mainnet",
  "rpc": [
    "https://omega.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.omtch.com"
  ],
  "slug": "omega",
  "icon": {
    "url": "ipfs://bafkreig676zxfhwhcx5bvvvjxedx6ftr2wq4iiznrwm3c6ozrprbc4oxwm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Omega Network Coin",
    "symbol": "OMN",
    "decimals": 18
  },
  "shortName": "OmegaNetwork",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;