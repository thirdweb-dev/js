import type { Chain } from "../src/types";
export default {
  "chain": "rAna",
  "chainId": 1807,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://rabbit.analogscan.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://analogfaucet.com"
  ],
  "icon": {
    "url": "ipfs://QmdfbjjF3ZzN2jTkH9REgrA8jDS6A6c21n7rbWSVbSnvQc",
    "width": 310,
    "height": 251,
    "format": "svg"
  },
  "infoURL": "https://rabbit.analogscan.com",
  "name": "Rabbit Analog Testnet Chain",
  "nativeCurrency": {
    "name": "Rabbit Analog Test Chain Native Token ",
    "symbol": "rAna",
    "decimals": 18
  },
  "networkId": 1807,
  "rpc": [
    "https://rabbit-analog-testnet-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1807.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rabbit.analog-rpc.com"
  ],
  "shortName": "rAna",
  "slug": "rabbit-analog-testnet-chain",
  "testnet": true
} as const satisfies Chain;