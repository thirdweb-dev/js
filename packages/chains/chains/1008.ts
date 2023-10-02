import type { Chain } from "../src/types";
export default {
  "chain": "EUN",
  "chainId": 1008,
  "explorers": [
    {
      "name": "eurusexplorer",
      "url": "https://explorer.eurus.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmaGd5L9jGPbfyGXBFhu9gjinWJ66YtNrXq8x6Q98Eep9e",
    "width": 471,
    "height": 471,
    "format": "svg"
  },
  "infoURL": "https://eurus.network",
  "name": "Eurus Mainnet",
  "nativeCurrency": {
    "name": "Eurus",
    "symbol": "EUN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://eurus.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.eurus.network/"
  ],
  "shortName": "eun",
  "slug": "eurus",
  "testnet": false
} as const satisfies Chain;