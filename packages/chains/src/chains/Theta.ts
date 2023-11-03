import type { Chain } from "../types";
export default {
  "chain": "Theta",
  "chainId": 361,
  "explorers": [
    {
      "name": "Theta Mainnet Explorer",
      "url": "https://explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.thetatoken.org/",
  "name": "Theta Mainnet",
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "networkId": 361,
  "rpc": [
    "https://theta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://361.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api.thetatoken.org/rpc"
  ],
  "shortName": "theta-mainnet",
  "slug": "theta",
  "testnet": false
} as const satisfies Chain;