import type { Chain } from "../src/types";
export default {
  "chain": "Optimism",
  "chainId": 2125031,
  "explorers": [
    {
      "name": "Bubs Sepolia Explorer",
      "url": "https://bubs-sepolia.explorer.caldera.xyz/",
      "standard": "EIP1559",
      "icon": {
        "url": "https://raw.githubusercontent.com/twitter/twemoji/d94f4cf793e6d5ca592aa00f58a88f6a4229ad43/assets/svg/1f9cb.svg",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://bubs-sepolia.hub.caldera.xyz/"
  ],
  "features": [],
  "icon": {
    "url": "https://raw.githubusercontent.com/twitter/twemoji/d94f4cf793e6d5ca592aa00f58a88f6a4229ad43/assets/svg/1f9cb.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://bubs-sepolia.hub.caldera.xyz/",
  "name": "Bubs Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2125031,
  "redFlags": [],
  "rpc": [
    "https://2125031.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bubs-sepolia.rpc.caldera.xyz/http",
    "wss://bubs-sepolia.rpc.caldera.xyz/ws"
  ],
  "shortName": "Bubs",
  "slug": "bubs-testnet-bubs",
  "testnet": true
} as const satisfies Chain;