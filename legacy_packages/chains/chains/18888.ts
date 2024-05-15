import type { Chain } from "../src/types";
export default {
  "chain": "Titan (TKX)",
  "chainId": 18888,
  "explorers": [
    {
      "name": "Titan Explorer",
      "url": "https://tkxscan.io/Titan",
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
  "name": "Titan (TKX)",
  "nativeCurrency": {
    "name": "Titan tkx",
    "symbol": "TKX",
    "decimals": 18
  },
  "networkId": 18888,
  "rpc": [
    "https://18888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://titan-json-rpc.titanlab.io",
    "https://titan-json-rpc-tokyo.titanlab.io",
    "https://titan-json-rpc-seoul.titanlab.io",
    "https://titan-json-rpc-hongkong.titanlab.io"
  ],
  "shortName": "titan_tkx",
  "slip44": 1,
  "slug": "titan-tkx",
  "testnet": false
} as const satisfies Chain;