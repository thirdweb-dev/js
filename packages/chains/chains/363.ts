import type { Chain } from "../src/types";
export default {
  "chainId": 363,
  "chain": "Theta",
  "name": "Theta Sapphire Testnet",
  "rpc": [
    "https://theta-sapphire-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-api-sapphire.thetatoken.org/rpc"
  ],
  "slug": "theta-sapphire-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.thetatoken.org/",
  "shortName": "theta-sapphire",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Theta Sapphire Testnet Explorer",
      "url": "https://guardian-testnet-sapphire-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;