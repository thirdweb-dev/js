import type { Chain } from "../src/types";
export default {
  "chain": "Theta",
  "chainId": 364,
  "explorers": [
    {
      "name": "Theta Amber Testnet Explorer",
      "url": "https://guardian-testnet-amber-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.thetatoken.org/",
  "name": "Theta Amber Testnet",
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://theta-amber-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api-amber.thetatoken.org/rpc"
  ],
  "shortName": "theta-amber",
  "slug": "theta-amber-testnet",
  "testnet": true
} as const satisfies Chain;