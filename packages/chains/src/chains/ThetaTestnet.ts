import type { Chain } from "../types";
export default {
  "chain": "Theta",
  "chainId": 365,
  "explorers": [
    {
      "name": "Theta Testnet Explorer",
      "url": "https://testnet-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.thetatoken.org/",
  "name": "Theta Testnet",
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "networkId": 365,
  "rpc": [
    "https://theta-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://365.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api-testnet.thetatoken.org/rpc"
  ],
  "shortName": "theta-testnet",
  "slug": "theta-testnet",
  "testnet": true
} as const satisfies Chain;