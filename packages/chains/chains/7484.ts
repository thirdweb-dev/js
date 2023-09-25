import type { Chain } from "../src/types";
export default {
  "chainId": 7484,
  "chain": "Raba",
  "name": "Raba Network Mainnet",
  "rpc": [
    "https://raba-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.x.raba.app/",
    "wss://rpc.x.raba.app/ws/"
  ],
  "slug": "raba-network",
  "icon": {
    "url": "ipfs://QmatP9qMHEYoXqRDyHMTyjYRQa6j6Gk7pmv1QLxQkvpGRP",
    "width": 787,
    "height": 750,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Raba",
    "symbol": "RABA",
    "decimals": 18
  },
  "infoURL": "https://x.raba.app/",
  "shortName": "raba",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "raba",
      "url": "https://x.raba.app/explorer",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;