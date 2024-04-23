import type { Chain } from "../src/types";
export default {
  "chain": "Titan (TKX)",
  "chainId": 18889,
  "explorers": [
    {
      "name": "Titan Explorer",
      "url": "https://titan-testnet-explorer-light.titanlab.io/Titan%20Testnet",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreicyvc7t55zsejv6vwaxbmhvea5vdfkkbgqkmn65rhyyifpg3mq3ua",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreicyvc7t55zsejv6vwaxbmhvea5vdfkkbgqkmn65rhyyifpg3mq3ua",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://titanlab.io",
  "name": "Titan (TKX) Testnet",
  "nativeCurrency": {
    "name": "Titan tkx",
    "symbol": "TKX",
    "decimals": 18
  },
  "networkId": 18889,
  "rpc": [
    "https://18889.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://titan-testnet-json-rpc.titanlab.io",
    "https://titan-testnet-json-rpc-1.titanlab.io",
    "https://titan-testnet-json-rpc-2.titanlab.io"
  ],
  "shortName": "titan_tkx-testnet",
  "slip44": 1,
  "slug": "titan-tkx-testnet",
  "testnet": true
} as const satisfies Chain;