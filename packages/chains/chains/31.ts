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
  "icon": "rootstock",
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