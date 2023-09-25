import type { Chain } from "../src/types";
export default {
  "chainId": 1984,
  "chain": "EUN",
  "name": "Eurus Testnet",
  "rpc": [
    "https://eurus-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.eurus.network"
  ],
  "slug": "eurus-testnet",
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
  "shortName": "euntest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "testnetexplorer",
      "url": "https://testnetexplorer.eurus.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;