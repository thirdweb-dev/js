import type { Chain } from "../src/types";
export default {
  "name": "Rootstock Testnet",
  "chain": "Rootstock",
  "rpc": [
    "https://rootstock-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node.testnet.rsk.co",
    "https://mycrypto.testnet.rsk.co"
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
  "nativeCurrency": {
    "name": "Testnet Smart Bitcoin",
    "symbol": "tRBTC",
    "decimals": 18
  },
  "infoURL": "https://rootstock.io",
  "shortName": "trsk",
  "chainId": 31,
  "networkId": 31,
  "explorers": [
    {
      "name": "RSK Testnet Explorer",
      "url": "https://explorer.testnet.rsk.co",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "rootstock-testnet"
} as const satisfies Chain;