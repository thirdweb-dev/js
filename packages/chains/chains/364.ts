import type { Chain } from "../src/types";
export default {
  "chainId": 364,
  "chain": "Theta",
  "name": "Theta Amber Testnet",
  "rpc": [
    "https://theta-amber-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api-amber.thetatoken.org/rpc"
  ],
  "slug": "theta-amber-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.thetatoken.org/",
  "shortName": "theta-amber",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Theta Amber Testnet Explorer",
      "url": "https://guardian-testnet-amber-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;