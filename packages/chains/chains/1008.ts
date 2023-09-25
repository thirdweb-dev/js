import type { Chain } from "../src/types";
export default {
  "chainId": 1008,
  "chain": "EUN",
  "name": "Eurus Mainnet",
  "rpc": [
    "https://eurus.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.eurus.network/"
  ],
  "slug": "eurus",
  "icon": {
    "url": "ipfs://QmaGd5L9jGPbfyGXBFhu9gjinWJ66YtNrXq8x6Q98Eep9e",
    "width": 471,
    "height": 471,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Eurus",
    "symbol": "EUN",
    "decimals": 18
  },
  "infoURL": "https://eurus.network",
  "shortName": "eun",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "eurusexplorer",
      "url": "https://explorer.eurus.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;