import type { Chain } from "../src/types";
export default {
  "chainId": 6565,
  "chain": "FOX",
  "name": "Fox Testnet Network",
  "rpc": [
    "https://fox-testnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet-v1.foxchain.app/",
    "https://rpc2-testnet-v1.foxchain.app/",
    "https://rpc3-testnet-v1.foxchain.app"
  ],
  "slug": "fox-testnet-network",
  "icon": {
    "url": "ipfs://Qmbp1rwhtRr6JQRyYqyfLqkbmzXr1T17zbmChsi2ouvg3M",
    "width": 100,
    "height": 100,
    "format": "png"
  },
  "faucets": [
    "https://faucet.foxchain.app"
  ],
  "nativeCurrency": {
    "name": "FOX Native Token",
    "symbol": "tFOX",
    "decimals": 18
  },
  "infoURL": "https://foxchain.app",
  "shortName": "fox",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "FOX Testnet Explorer",
      "url": "https://testnet.foxscan.app",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;