import type { Chain } from "../src/types";
export default {
  "chainId": 16718,
  "chain": "ambnet",
  "name": "AirDAO Mainnet",
  "rpc": [
    "https://airdao.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.ambrosus.io"
  ],
  "slug": "airdao",
  "icon": {
    "url": "ipfs://QmSxXjvWng3Diz4YwXDV2VqSPgMyzLYBNfkjJcr7rzkxom",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Amber",
    "symbol": "AMB",
    "decimals": 18
  },
  "infoURL": "https://airdao.io",
  "shortName": "airdao",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "AirDAO Network Explorer",
      "url": "https://airdao.io/explorer",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;