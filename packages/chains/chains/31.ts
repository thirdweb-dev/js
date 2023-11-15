import type { Chain } from "../src/types";
export default {
  "chain": "Rootstock",
  "chainId": 31,
  "explorers": [
    {
      "name": "RSK Testnet Explorer",
      "url": "https://explorer.testnet.rsk.co",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.rsk.co/"
  ],
  "icon": {
    "url": "ipfs://bafkreigidzbf22dnpmmlfxv6u7oifq6ln33j4n57ox4ipiproalufrheym",
    "width": 3000,
    "height": 3325,
    "format": "png"
  },
  "infoURL": "https://rootstock.io",
  "name": "Rootstock Testnet",
  "nativeCurrency": {
    "name": "Testnet Smart Bitcoin",
    "symbol": "tRBTC",
    "decimals": 18
  },
  "networkId": 31,
  "rpc": [
    "https://rootstock-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://31.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node.testnet.rsk.co",
    "https://mycrypto.testnet.rsk.co"
  ],
  "shortName": "trsk",
  "slug": "rootstock-testnet",
  "testnet": true
} as const satisfies Chain;