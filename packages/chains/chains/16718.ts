import type { Chain } from "../src/types";
export default {
  "chain": "ambnet",
  "chainId": 16718,
  "explorers": [
    {
      "name": "AirDAO Network Explorer",
      "url": "https://airdao.io/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSxXjvWng3Diz4YwXDV2VqSPgMyzLYBNfkjJcr7rzkxom",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://airdao.io",
  "name": "AirDAO Mainnet",
  "nativeCurrency": {
    "name": "Amber",
    "symbol": "AMB",
    "decimals": 18
  },
  "networkId": 16718,
  "rpc": [
    "https://airdao.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://16718.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.ambrosus.io"
  ],
  "shortName": "airdao",
  "slug": "airdao",
  "testnet": false
} as const satisfies Chain;