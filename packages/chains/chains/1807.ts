import type { Chain } from "../src/types";
export default {
  "chainId": 1807,
  "chain": "rAna",
  "name": "Rabbit Analog Testnet Chain",
  "rpc": [
    "https://rabbit-analog-testnet-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rabbit.analog-rpc.com"
  ],
  "slug": "rabbit-analog-testnet-chain",
  "icon": {
    "url": "ipfs://QmdfbjjF3ZzN2jTkH9REgrA8jDS6A6c21n7rbWSVbSnvQc",
    "width": 310,
    "height": 251,
    "format": "svg"
  },
  "faucets": [
    "https://analogfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Rabbit Analog Test Chain Native Token ",
    "symbol": "rAna",
    "decimals": 18
  },
  "infoURL": "https://rabbit.analogscan.com",
  "shortName": "rAna",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://rabbit.analogscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;