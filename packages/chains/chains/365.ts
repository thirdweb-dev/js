import type { Chain } from "../src/types";
export default {
  "chainId": 365,
  "chain": "Theta",
  "name": "Theta Testnet",
  "rpc": [
    "https://theta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api-testnet.thetatoken.org/rpc"
  ],
  "slug": "theta-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.thetatoken.org/",
  "shortName": "theta-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Theta Testnet Explorer",
      "url": "https://testnet-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;