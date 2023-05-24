import type { Chain } from "../src/types";
export default {
  "name": "Fox Testnet Network",
  "chain": "FOX",
  "rpc": [
    "https://fox-testnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet-v1.foxchain.app/",
    "https://rpc2-testnet-v1.foxchain.app/",
    "https://rpc3-testnet-v1.foxchain.app"
  ],
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
  "chainId": 6565,
  "networkId": 6565,
  "icon": {
    "url": "ipfs://Qmbp1rwhtRr6JQRyYqyfLqkbmzXr1T17zbmChsi2ouvg3M",
    "width": 100,
    "height": 100,
    "format": "png"
  },
  "explorers": [
    {
      "name": "FOX Testnet Explorer",
      "icon": {
        "url": "ipfs://Qmbp1rwhtRr6JQRyYqyfLqkbmzXr1T17zbmChsi2ouvg3M",
        "width": 100,
        "height": 100,
        "format": "png"
      },
      "url": "https://testnet.foxscan.app",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "fox-testnet-network"
} as const satisfies Chain;