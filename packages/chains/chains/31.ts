import type { Chain } from "../src/types";
export default {
  "chainId": 31,
  "chain": "Rootstock",
  "name": "Rootstock Testnet",
  "rpc": [
    "https://rootstock-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node.testnet.rsk.co",
    "https://mycrypto.testnet.rsk.co"
  ],
  "slug": "rootstock-testnet",
  "icon": {
    "url": "ipfs://bafkreigidzbf22dnpmmlfxv6u7oifq6ln33j4n57ox4ipiproalufrheym",
    "width": 3000,
    "height": 3325,
    "format": "png"
  },
  "faucets": [
    "https://faucet.rsk.co/"
  ],
  "nativeCurrency": {
    "name": "Testnet Smart Bitcoin",
    "symbol": "tRBTC",
    "decimals": 18
  },
  "infoURL": "https://rootstock.io",
  "shortName": "trsk",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "RSK Testnet Explorer",
      "url": "https://explorer.testnet.rsk.co",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;