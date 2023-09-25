import type { Chain } from "../src/types";
export default {
  "chainId": 361,
  "chain": "Theta",
  "name": "Theta Mainnet",
  "rpc": [
    "https://theta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api.thetatoken.org/rpc"
  ],
  "slug": "theta",
  "faucets": [],
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.thetatoken.org/",
  "shortName": "theta-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Theta Mainnet Explorer",
      "url": "https://explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;