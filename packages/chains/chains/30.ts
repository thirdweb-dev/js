import type { Chain } from "../src/types";
export default {
  "name": "Rootstock Mainnet",
  "chain": "Rootstock",
  "rpc": [
    "https://rootstock.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node.rsk.co",
    "https://mycrypto.rsk.co"
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreigidzbf22dnpmmlfxv6u7oifq6ln33j4n57ox4ipiproalufrheym",
    "width": 3000,
    "height": 3325,
    "format": "png"
  },
  "nativeCurrency": {
    "name": "Smart Bitcoin",
    "symbol": "RBTC",
    "decimals": 18
  },
  "infoURL": "https://rootstock.io",
  "shortName": "rsk",
  "chainId": 30,
  "networkId": 30,
  "slip44": 137,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://rootstock.blockscout.com",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    },
    {
      "name": "Rootstock Explorer",
      "url": "https://explorer.rsk.co",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "rootstock"
} as const satisfies Chain;