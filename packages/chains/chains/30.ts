import type { Chain } from "../src/types";
export default {
  "chain": "Rootstock",
  "chainId": 30,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://rootstock.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "Rootstock Explorer",
      "url": "https://explorer.rsk.co",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreigidzbf22dnpmmlfxv6u7oifq6ln33j4n57ox4ipiproalufrheym",
    "width": 3000,
    "height": 3325,
    "format": "png"
  },
  "infoURL": "https://rootstock.io",
  "name": "Rootstock Mainnet",
  "nativeCurrency": {
    "name": "Smart Bitcoin",
    "symbol": "RBTC",
    "decimals": 18
  },
  "networkId": 30,
  "rpc": [
    "https://rootstock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://30.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node.rsk.co",
    "https://mycrypto.rsk.co"
  ],
  "shortName": "rsk",
  "slip44": 137,
  "slug": "rootstock",
  "testnet": false
} as const satisfies Chain;