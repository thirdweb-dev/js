import type { Chain } from "../src/types";
export default {
  "chain": "FTH",
  "chainId": 308,
  "explorers": [
    {
      "name": "furthscan",
      "url": "http://furthscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "Furthscan Network Explorer",
      "url": "http://furthscan.com/",
      "standard": "standard",
      "icon": {
        "url": "ipfs://QmaZCiLBHGvQptmspWseHHs6L9iCHGKZbqVTqZ7Cf557Vg",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmaZCiLBHGvQptmspWseHHs6L9iCHGKZbqVTqZ7Cf557Vg",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "http://furthscan.com/",
  "name": "Furtheon Network",
  "nativeCurrency": {
    "name": "Furtheon",
    "symbol": "FTH",
    "decimals": 18
  },
  "networkId": 308,
  "redFlags": [],
  "rpc": [
    "https://308.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.furtheon.org/",
    "https://rpc.furtheon.org"
  ],
  "shortName": "FTH",
  "slug": "furtheon-network",
  "testnet": false
} as const satisfies Chain;