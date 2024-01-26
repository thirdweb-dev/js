import type { Chain } from "../src/types";
export default {
  "chain": "Oasys",
  "chainId": 248,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.oasys.games",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmYcGHTPheBwLv9zoJfQAJ7NB6MCtXe2zV7XqPyiTJg3WP/Oasys_Large%20Logo%20Black.png",
    "width": 1250,
    "height": 1250,
    "format": ".png"
  },
  "infoURL": "https://oasys.games",
  "name": "Oasys Mainnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 248,
  "redFlags": [],
  "rpc": [
    "https://oasys.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://248.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.oasys.games"
  ],
  "shortName": "OAS",
  "slug": "oasys",
  "testnet": false
} as const satisfies Chain;