import type { Chain } from "../src/types";
export default {
  "name": "Theta Sapphire Testnet",
  "chain": "Theta",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Theta Fuel",
    "symbol": "TFUEL",
    "decimals": 18
  },
  "infoURL": "https://www.thetatoken.org/",
  "shortName": "theta-sapphire",
  "chainId": 363,
  "networkId": 363,
  "explorers": [
    {
      "name": "Theta Sapphire Testnet Explorer",
      "url": "https://guardian-testnet-sapphire-explorer.thetatoken.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "theta-sapphire-testnet"
} as const satisfies Chain;