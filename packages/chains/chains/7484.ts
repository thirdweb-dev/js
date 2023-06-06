import type { Chain } from "../src/types";
export default {
  "name": "Raba Network Mainnet",
  "chain": "Raba",
  "icon": {
    "url": "ipfs://QmatP9qMHEYoXqRDyHMTyjYRQa6j6Gk7pmv1QLxQkvpGRP",
    "width": 787,
    "height": 750,
    "format": "png"
  },
  "rpc": [
    "https://raba-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.x.raba.app/",
    "wss://rpc.x.raba.app/ws/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Raba",
    "symbol": "RABA",
    "decimals": 18
  },
  "infoURL": "https://x.raba.app/",
  "shortName": "raba",
  "chainId": 7484,
  "networkId": 7484,
  "explorers": [
    {
      "name": "raba",
      "url": "https://x.raba.app/explorer",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "raba-network"
} as const satisfies Chain;