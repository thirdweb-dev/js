import type { Chain } from "../src/types";
export default {
  "chain": "Theta",
  "chainId": 363,
  "explorers": [
    {
      "name": "Theta Sapphire Testnet Explorer",
      "url": "https://guardian-testnet-sapphire-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.thetatoken.org/",
  "name": "Theta Sapphire Testnet",
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://theta-sapphire-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api-sapphire.thetatoken.org/rpc"
  ],
  "shortName": "theta-sapphire",
  "slug": "theta-sapphire-testnet",
  "testnet": true
} as const satisfies Chain;