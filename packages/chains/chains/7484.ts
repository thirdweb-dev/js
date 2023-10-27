import type { Chain } from "../src/types";
export default {
  "chain": "Raba",
  "chainId": 7484,
  "explorers": [
    {
      "name": "raba",
      "url": "https://x.raba.app/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmatP9qMHEYoXqRDyHMTyjYRQa6j6Gk7pmv1QLxQkvpGRP",
    "width": 787,
    "height": 750,
    "format": "png"
  },
  "infoURL": "https://x.raba.app/",
  "name": "Raba Network Mainnet",
  "nativeCurrency": {
    "name": "Raba",
    "symbol": "RABA",
    "decimals": 18
  },
  "networkId": 7484,
  "rpc": [
    "https://raba-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7484.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.x.raba.app/",
    "wss://rpc.x.raba.app/ws/"
  ],
  "shortName": "raba",
  "slug": "raba-network",
  "testnet": false
} as const satisfies Chain;