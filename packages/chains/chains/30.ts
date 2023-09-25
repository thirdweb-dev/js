import type { Chain } from "../src/types";
export default {
  "chainId": 30,
  "chain": "Rootstock",
  "name": "Rootstock Mainnet",
  "rpc": [
    "https://rootstock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node.rsk.co",
    "https://mycrypto.rsk.co"
  ],
  "slug": "rootstock",
  "icon": {
    "url": "ipfs://bafkreigidzbf22dnpmmlfxv6u7oifq6ln33j4n57ox4ipiproalufrheym",
    "width": 3000,
    "height": 3325,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Smart Bitcoin",
    "symbol": "RBTC",
    "decimals": 18
  },
  "infoURL": "https://rootstock.io",
  "shortName": "rsk",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Rootstock Explorer",
      "url": "https://explorer.rsk.co",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://rootstock.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;